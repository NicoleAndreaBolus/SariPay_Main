import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';

// ExtendsClass JSON storage container details (Free, no account needed, works in serverless)
const BIN_ID = 'dabdfbb';
const API_URL = `https://extendsclass.com/api/json-storage/bin/${BIN_ID}`;

// Fallback in-memory cache to prevent app crashes if external API is temporarily down
let localMemoryDb: any = {
  workspaces: [],
  orders: [],
  users: [],
  disputes: [],
  tickets: [],
  adminLogs: [],
};

// Check if Postgres is configured
const isPostgresConfigured = typeof process.env.POSTGRES_URL !== 'undefined';

// Read from the shared cloud database
async function readDb() {
  if (isPostgresConfigured) {
    try {
      // Query database state row
      const { rows } = await sql`SELECT val FROM saripay_state WHERE key = 'database' LIMIT 1`;
      if (rows && rows.length > 0) {
        localMemoryDb = rows[0].val;
        return rows[0].val;
      }
    } catch (e: any) {
      // If table doesn't exist, create it!
      if (e.message && (e.message.includes('relation "saripay_state" does not exist') || e.code === '42P01')) {
        try {
          await sql`CREATE TABLE IF NOT EXISTS saripay_state (key VARCHAR(255) PRIMARY KEY, val JSONB)`;
          console.log('[Sync Database] Created saripay_state table in Postgres.');
        } catch (createErr) {
          console.error('[Sync Database] Failed to create postgres table:', createErr);
        }
      } else {
        console.error('[Sync Database] Postgres read query failed:', e);
      }
    }

    // Default baseline if query returned nothing or table was just created
    const fallback = {
      workspaces: [],
      orders: [],
      users: [],
      disputes: [],
      tickets: [],
      adminLogs: [],
    };
    try {
      await sql`INSERT INTO saripay_state (key, val) VALUES ('database', ${JSON.stringify(fallback)}) ON CONFLICT (key) DO NOTHING`;
    } catch (insertErr) {
      console.error('[Sync Database] Failed to insert fallback state in Postgres:', insertErr);
    }
    localMemoryDb = fallback;
    return fallback;
  }

  // Fallback to free JSON bin if Postgres is not configured (e.g. local dev)
  const res = await fetch(API_URL, {
    method: 'GET',
    headers: {
      'Cache-Control': 'no-cache',
    },
    cache: 'no-store', // Crucial to disable Next.js static caching
  });
  if (!res.ok) {
    throw new Error(`Failed to read database: status ${res.status}`);
  }
  const data = await res.json();
  localMemoryDb = data; // Update in-memory cache
  return data;
}

// Write to the shared cloud database
async function writeDb(data: any) {
  localMemoryDb = data; // Update in-memory cache

  if (isPostgresConfigured) {
    try {
      await sql`INSERT INTO saripay_state (key, val) VALUES ('database', ${JSON.stringify(data)}) ON CONFLICT (key) DO UPDATE SET val = EXCLUDED.val`;
      return;
    } catch (e) {
      console.error('[Sync Database] Postgres write failed:', e);
    }
  }

  // Fallback to free JSON bin
  const res = await fetch(API_URL, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to write database: status ${res.status}`);
  }
}

// Helper to merge items based on unique id (for general collections like orders, users)
function mergeArrays(serverArray: any[], clientArray: any[], key = 'id') {
  const map = new Map();
  // Load server items
  for (const item of serverArray || []) {
    if (item && item[key]) {
      map.set(item[key], item);
    }
  }
  // Load client items and merge
  for (const item of clientArray || []) {
    if (item && item[key]) {
      const existing = map.get(item[key]);
      if (!existing) {
        map.set(item[key], item);
      } else {
        // Merge fields
        let mergedItem = { ...existing, ...item };

        // Handle order status priorities
        if (item.status) {
          const sStatus = existing.status;
          const cStatus = item.status;
          const statusOrder = [
            'Initialized',
            'Funded',
            'In Transit',
            'Delivered',
            'Canceled',
          ];
          const sIndex = statusOrder.indexOf(sStatus);
          const cIndex = statusOrder.indexOf(cStatus);
          if (sIndex > cIndex) {
            mergedItem.status = sStatus;
          } else {
            mergedItem.status = cStatus;
          }
        }

        map.set(item[key], mergedItem);
      }
    }
  }
  return Array.from(map.values());
}

// Helper to merge fields of a workspace item
function mergeWorkspaceItem(existing: any, item: any) {
  let mergedItem = { ...existing, ...item };
  if (item.type === 'merchant' || item.type === 'distributor') {
    const sTime = existing.statusUpdatedAt || 0;
    const cTime = item.statusUpdatedAt || 0;

    if (sTime !== 0 || cTime !== 0) {
      if (sTime > cTime) {
        mergedItem.verificationStatus = existing.verificationStatus;
        mergedItem.rejectionReason = existing.rejectionReason;
        mergedItem.missingDocs = existing.missingDocs;
        mergedItem.internalNotes = existing.internalNotes;
        mergedItem.statusUpdatedAt = existing.statusUpdatedAt;
      } else {
        mergedItem.verificationStatus = item.verificationStatus;
        mergedItem.rejectionReason = item.rejectionReason;
        mergedItem.missingDocs = item.missingDocs;
        mergedItem.internalNotes = item.internalNotes;
        mergedItem.statusUpdatedAt = item.statusUpdatedAt;
      }
    } else {
      const sStatus = existing.verificationStatus || 'Unverified';
      const cStatus = item.verificationStatus || 'Unverified';
      const statusOrder = [
        'Unverified',
        'Pending Review',
        'Requires Additional Information',
        'Rejected',
        'Verified',
      ];
      const sIndex = statusOrder.indexOf(sStatus);
      const cIndex = statusOrder.indexOf(cStatus);
      if (sIndex > cIndex) {
        mergedItem.verificationStatus = sStatus;
        mergedItem.rejectionReason = existing.rejectionReason;
        mergedItem.missingDocs = existing.missingDocs;
        mergedItem.internalNotes = existing.internalNotes;
      } else {
        mergedItem.verificationStatus = cStatus;
      }
    }
  }
  return mergedItem;
}

// Special workspaces merge helper supporting client-side deletions
function mergeWorkspaces(
  serverWorkspaces: any[],
  clientWorkspaces: any[],
  clientWalletAddress: string | null,
  isAdmin: boolean,
  deletedWorkspaceIds: string[] = []
) {
  const deletedSet = new Set(deletedWorkspaceIds || []);
  
  // Filter out any server workspaces that are explicitly deleted
  const filteredServerWorkspaces = (serverWorkspaces || []).filter(
    (w) => w && w.id && !deletedSet.has(w.id)
  );

  const serverMap = new Map();
  for (const item of filteredServerWorkspaces) {
    if (item && item.id) {
      serverMap.set(item.id, item);
    }
  }

  const clientMap = new Map();
  // Filter out any client workspaces that are explicitly deleted
  const filteredClientWorkspaces = (clientWorkspaces || []).filter(
    (w) => w && w.id && !deletedSet.has(w.id)
  );
  
  for (const item of filteredClientWorkspaces) {
    if (item && item.id) {
      clientMap.set(item.id, item);
    }
  }

  const finalWorkspaces: any[] = [];

  if (isAdmin) {
    // Admin has access to all workspaces, but doesn't necessarily have all user workspaces loaded locally on first sync.
    // So we merge server workspaces with client workspaces:
    // 1. Process server workspaces
    for (const serverItem of serverMap.values()) {
      const clientItem = clientMap.get(serverItem.id);
      if (clientItem) {
        // Admin has it locally (e.g. updated verification status), merge it
        finalWorkspaces.push(mergeWorkspaceItem(serverItem, clientItem));
      } else {
        // Keep it (since admin hasn't deleted it, just might not have it in local storage yet)
        finalWorkspaces.push(serverItem);
      }
    }
    // 2. Add any workspaces that the client (admin) created or has that are not on the server
    for (const clientItem of filteredClientWorkspaces) {
      if (clientItem && clientItem.id && !serverMap.has(clientItem.id)) {
        finalWorkspaces.push(clientItem);
      }
    }
  } else {
    // If regular client, merge but respect deletions of their own workspaces.
    // 1. Process server workspaces
    for (const serverItem of serverMap.values()) {
      const clientItem = clientMap.get(serverItem.id);
      const belongsToClient = clientWalletAddress && serverItem.walletAddress === clientWalletAddress;

      if (belongsToClient) {
        if (clientItem) {
          // Client still has it, merge it
          finalWorkspaces.push(mergeWorkspaceItem(serverItem, clientItem));
        } else {
          // Client deleted it, skip it (deletes it from server)
          console.log(`[Sync API] Deleting workspace: ${serverItem.id} belonging to client ${clientWalletAddress}`);
        }
      } else {
        // Belongs to someone else, keep it
        if (clientItem) {
          finalWorkspaces.push(mergeWorkspaceItem(serverItem, clientItem));
        } else {
          finalWorkspaces.push(serverItem);
        }
      }
    }

    // 2. Add any new workspaces client created
    for (const clientItem of filteredClientWorkspaces) {
      if (clientItem && clientItem.id && !serverMap.has(clientItem.id)) {
        const status = clientItem.verificationStatus || 'Unverified';
        if (status === 'Unverified') {
          finalWorkspaces.push(clientItem);
        } else {
          console.log(`[Sync API] Ignoring deleted workspace ${clientItem.id} sent by client.`);
        }
      }
    }
  }

  return finalWorkspaces;
}

const cacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
};

export async function GET() {
  const db = await readDb();
  return NextResponse.json(db, { headers: cacheHeaders });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Check if client is requesting a hard reset of database (e.g. from Admin console reset)
    if (body.isReset) {
      const resetData = {
        workspaces: body.workspaces || [],
        orders: body.orders || [],
        users: body.users || [],
        disputes: body.disputes || [],
        tickets: body.tickets || [],
        adminLogs: body.adminLogs || [],
      };
      await writeDb(resetData);
      return NextResponse.json(resetData, { headers: cacheHeaders });
    }

    const currentDb = await readDb();
    
    const clientWalletAddress = body.clientWalletAddress || null;
    const isAdmin = body.isAdmin || false;
    const deletedWorkspaceIds = body.deletedWorkspaceIds || [];

    // Merge each list
    const mergedDb = {
      workspaces: mergeWorkspaces(currentDb.workspaces, body.workspaces, clientWalletAddress, isAdmin, deletedWorkspaceIds),
      orders: mergeArrays(currentDb.orders, body.orders),
      users: mergeArrays(currentDb.users, body.users),
      disputes: mergeArrays(currentDb.disputes, body.disputes),
      tickets: mergeArrays(currentDb.tickets, body.tickets),
      adminLogs: mergeArrays(currentDb.adminLogs, body.adminLogs),
    };

    await writeDb(mergedDb);
    return NextResponse.json(mergedDb, { headers: cacheHeaders });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400, headers: cacheHeaders });
  }
}
