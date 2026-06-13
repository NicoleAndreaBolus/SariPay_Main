import { NextResponse } from 'next/server';

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

// Read from the shared cloud database
async function readDb() {
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

// Helper to merge items based on unique id
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

        // Handle workspace verificationStatus priorities
        if (item.type === 'merchant' || item.type === 'distributor') {
          const sTime = existing.statusUpdatedAt || 0;
          const cTime = item.statusUpdatedAt || 0;

          if (sTime !== 0 || cTime !== 0) {
            // If timestamps exist, the newer timestamp wins
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
            // Fallback to index-based comparison if timestamps are missing
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

    // Merge each list
    const mergedDb = {
      workspaces: mergeArrays(currentDb.workspaces, body.workspaces),
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
