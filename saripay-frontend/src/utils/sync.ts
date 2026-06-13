/**
 * Utility to synchronize local storage state with the server-side shared JSON database.
 * This enables multi-device testing (e.g., Merchant on one phone, Distributor on another)
 * to instantly see registrations, escrow states, and admin approvals.
 */
export async function syncWithServer(isReset = false, customData?: any) {
  if (typeof window === 'undefined') return null;

  try {
    let payload;
    if (isReset && customData) {
      payload = {
        isReset: true,
        workspaces: customData.workspaces || [],
        orders: customData.orders || [],
        users: customData.users || [],
        disputes: customData.disputes || [],
        tickets: customData.tickets || [],
        adminLogs: customData.adminLogs || [],
        clientWalletAddress: typeof window !== 'undefined' ? localStorage.getItem('saripay_wallet_address') : null,
        isAdmin: typeof window !== 'undefined' ? !!localStorage.getItem('saripay_admin_session') : false,
      };
    } else {
      payload = {
        workspaces: JSON.parse(localStorage.getItem('saripay_workspaces') || '[]'),
        orders: JSON.parse(localStorage.getItem('saripay_orders') || '[]'),
        users: JSON.parse(localStorage.getItem('saripay_users') || '[]'),
        disputes: JSON.parse(localStorage.getItem('saripay_disputes') || '[]'),
        tickets: JSON.parse(localStorage.getItem('saripay_support_tickets') || '[]'),
        adminLogs: JSON.parse(localStorage.getItem('saripay_admin_logs') || '[]'),
        clientWalletAddress: typeof window !== 'undefined' ? localStorage.getItem('saripay_wallet_address') : null,
        isAdmin: typeof window !== 'undefined' ? !!localStorage.getItem('saripay_admin_session') : false,
      };
    }

    const res = await fetch(`/api/sync?t=${Date.now()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
      cache: 'no-store',
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Sync responded with status ${res.status}`);
    }

    const data = await res.json();

    // Update LocalStorage keys with the merged databases returned from server
    if (data.workspaces) localStorage.setItem('saripay_workspaces', JSON.stringify(data.workspaces));
    if (data.orders) localStorage.setItem('saripay_orders', JSON.stringify(data.orders));
    if (data.users) localStorage.setItem('saripay_users', JSON.stringify(data.users));
    if (data.disputes) localStorage.setItem('saripay_disputes', JSON.stringify(data.disputes));
    if (data.tickets) localStorage.setItem('saripay_support_tickets', JSON.stringify(data.tickets));
    if (data.adminLogs) localStorage.setItem('saripay_admin_logs', JSON.stringify(data.adminLogs));

    return data;
  } catch (err) {
    console.error('[Sync Utility] Sync failed:', err);
    return null;
  }
}
