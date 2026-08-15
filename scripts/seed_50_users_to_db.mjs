import fs from 'fs';
import path from 'path';

async function main() {
  console.log('🚀 Seeding 50 Pilot Users and Workspaces into Database & Admin State...');

  const rawUsers = JSON.parse(fs.readFileSync(path.resolve('docs', 'user_interactions_50.json'), 'utf-8'));
  console.log(`Loaded ${rawUsers.length} pilot users from dataset.`);

  const workspaces = [];
  const users = [];
  const orders = [];

  const cities = ['Quezon City', 'Manila', 'Pasig City', 'Makati City', 'Taguig City', 'Cebu City', 'Davao City', 'Caloocan', 'Mandaluyong', 'Pampanga', 'Laguna', 'Cavite', 'Bulacan', 'Batangas', 'Iloilo City'];

  rawUsers.forEach((u, idx) => {
    const isMerchant = u.role.includes('Merchant');
    const city = cities[idx % cities.length];

    // Create User Profile
    users.push({
      id: `USR-${100 + u.userIndex}`,
      name: u.name,
      email: u.email,
      walletAddress: u.address,
      workspacesCount: 1,
      status: 'Active',
      createdDate: `2026-07-${String(15 + (idx % 15)).padStart(2, '0')}`
    });

    if (isMerchant) {
      workspaces.push({
        id: `ws-merchant-${u.userIndex}`,
        name: `${u.name.split(' ')[0]}'s Sari-Sari Store`,
        type: 'merchant',
        verificationStatus: idx % 4 === 0 ? 'Pending Review' : 'Verified',
        statusUpdatedAt: Date.now() - (idx * 3600000),
        ownerName: u.name,
        storeAddress: `${100 + idx} Barangay ${10 + (idx % 20)}, ${city}`,
        contactNumber: `0917${String(1000000 + idx * 7777).slice(0, 7)}`,
        barangayPermit: `bp_permit_${u.userIndex}.pdf`,
        submittedDate: `2026-07-${String(10 + (idx % 18)).padStart(2, '0')}`,
        walletAddress: u.address
      });
    } else {
      workspaces.push({
        id: `ws-distributor-${u.userIndex}`,
        name: `${u.name.split(' ')[0]} Wholesale & Logistics`,
        type: 'distributor',
        verificationStatus: 'Verified',
        statusUpdatedAt: Date.now() - (idx * 3600000),
        contactPerson: u.name,
        contactNumber: `0918${String(2000000 + idx * 8888).slice(0, 7)}`,
        warehouseAddress: `Building ${idx + 1}, Logistics Park, ${city}`,
        registryId: `SEC-2026-${String(88000 + idx)}`,
        secRegistration: `sec_reg_${u.userIndex}.pdf`,
        submittedDate: `2026-07-${String(5 + (idx % 20)).padStart(2, '0')}`,
        walletAddress: u.address
      });
    }
  });

  // Seed 10 realistic B2B orders connecting merchants and suppliers
  const merchantWs = workspaces.filter(w => w.type === 'merchant');
  const distributorWs = workspaces.filter(w => w.type === 'distributor');

  for (let i = 0; i < 10; i++) {
    const m = merchantWs[i % merchantWs.length];
    const d = distributorWs[i % distributorWs.length];
    const statuses = ['Delivered', 'Delivered', 'Funded', 'Delivered', 'In Transit', 'Initialized', 'Delivered', 'Funded', 'Delivered', 'Delivered'];
    const amounts = ['85.84', '56.63', '119.46', '95.57', '69.91', '140.20', '45.00', '110.50', '88.00', '65.25'];
    const items = [
      '5x Great Taste Coffee Boxes, 10x Piattos',
      '12x Lucky Me Pancit Canton Bundles',
      '8x Purefoods Corned Beef, 4x Magnolia Milk',
      '15x Bear Brand Milk Powder 300g',
      '20x 555 Sardines, 10x Argentina Corned Beef',
      '4x Sacks Sinandomeng Rice 25kg',
      '10x Datu Puti Soy Sauce & Vinegar 1L',
      '6x Silver Swan Soy Sauce Gallons',
      '15x Safeguard Soap 3-Packs',
      '8x Tide Powder Detergent 500g'
    ];

    orders.push({
      id: `ORD-${8942 - i}`,
      supplier: d.name,
      amount: amounts[i],
      status: statuses[i],
      date: `2026-08-${String(1 + (i % 14)).padStart(2, '0')}`,
      details: items[i],
      merchantAddress: m.walletAddress,
      merchantName: m.name
    });
  }

  console.log(`Generated: ${workspaces.length} Workspaces (${merchantWs.length} Merchants, ${distributorWs.length} Distributors), ${users.length} Users, and ${orders.length} Orders.`);

  // Save to docs/seeded_workspaces_50.json
  const seededData = { workspaces, users, orders };
  fs.writeFileSync(path.resolve('docs', 'seeded_workspaces_50.json'), JSON.stringify(seededData, null, 2));

  // Sync to Cloud Storage Bin (dabdfbb)
  const API_URL = 'https://extendsclass.com/api/json-storage/bin/dabdfbb';
  try {
    console.log('Sending sync update to cloud database container...');
    const syncRes = await fetch(API_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
      body: JSON.stringify(seededData),
    });
    if (syncRes.ok) {
      console.log('✅ Successfully pushed 50 users and workspaces to Cloud JSON Database!');
    } else {
      console.warn('Cloud API responded with status:', syncRes.status);
    }
  } catch (syncErr) {
    console.warn('Direct cloud sync warning (will fallback to local defaults):', syncErr.message);
  }

  console.log('🎉 Seeding complete!');
}

main().catch(console.error);
