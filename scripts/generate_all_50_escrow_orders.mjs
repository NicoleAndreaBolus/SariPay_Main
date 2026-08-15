import fs from 'fs';
import path from 'path';

const rawUsers = JSON.parse(fs.readFileSync(path.resolve('docs', 'user_interactions_50.json'), 'utf-8'));
const seeded = JSON.parse(fs.readFileSync(path.resolve('docs', 'seeded_workspaces_50.json'), 'utf-8'));

const merchants = seeded.workspaces.filter(w => w.type === 'merchant');
const distributors = seeded.workspaces.filter(w => w.type === 'distributor');

const itemsCatalog = [
  '5x Great Taste Coffee Boxes, 10x Piattos',
  '12x Lucky Me Pancit Canton Bundles',
  '8x Purefoods Corned Beef, 4x Magnolia Milk',
  '15x Bear Brand Milk Powder 300g',
  '20x 555 Sardines, 10x Argentina Corned Beef',
  '4x Sacks Sinandomeng Rice 25kg',
  '10x Datu Puti Soy Sauce & Vinegar 1L',
  '6x Silver Swan Soy Sauce Gallons',
  '15x Safeguard Soap 3-Packs',
  '8x Tide Powder Detergent 500g',
  '12x Alaska Evaporated Milk 370ml',
  '6x Golden Fiesta Cooking Oil 1L',
  '24x Nissin Cup Noodles 60g',
  '10x UFC Banana Ketchup 550g',
  '8x San Miguel Pale Pilsen Cases'
];

const statusesPool = ['Delivered', 'Delivered', 'Funded', 'Delivered', 'In Transit', 'Delivered', 'Funded', 'Initialized', 'Delivered', 'Delivered'];
const amountsPool = ['85.84', '56.63', '119.46', '95.57', '69.91', '140.20', '45.00', '110.50', '88.00', '65.25', '78.50', '92.30', '135.00', '52.40', '104.80'];

const all50Orders = [];

for (let i = 0; i < 50; i++) {
  const m = merchants[i % merchants.length];
  const d = distributors[i % distributors.length];
  const status = statusesPool[i % statusesPool.length];
  const amount = amountsPool[i % amountsPool.length];
  const details = itemsCatalog[i % itemsCatalog.length];
  const day = String(1 + (i % 28)).padStart(2, '0');

  all50Orders.push({
    id: String(8942 - i),
    supplier: d.name,
    amount: amount,
    status: status,
    date: `2026-07-${day}`,
    details: details,
    merchantAddress: m.walletAddress,
    merchantName: m.name
  });
}

console.log(`Generated ${all50Orders.length} B2B Escrow Orders for all 50 pilot users.`);

// Update seeded_workspaces_50.json
seeded.orders = all50Orders;
fs.writeFileSync(path.resolve('docs', 'seeded_workspaces_50.json'), JSON.stringify(seeded, null, 2));

// Update admin files
function updateAdminFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf-8');

  const ordersStr = 'const DEFAULT_ORDERS: Order[] = ' + JSON.stringify(all50Orders, null, 2) + ';';
  code = code.replace(/const DEFAULT_ORDERS: Order\[\] = \[[\s\S]*?\];/m, ordersStr);

  fs.writeFileSync(filePath, code, 'utf-8');
  console.log(`Updated ${filePath} with all 50 escrow orders.`);
}

updateAdminFile(path.resolve('src', 'app', 'admin', 'page.tsx'));
updateAdminFile(path.resolve('saripay-frontend', 'src', 'app', 'admin', 'page.tsx'));

// Push to Cloud JSON Database container (dabdfbb)
const API_URL = 'https://extendsclass.com/api/json-storage/bin/dabdfbb';
fetch(API_URL, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
  },
  body: JSON.stringify(seeded),
}).then(res => {
  if (res.ok) console.log('✅ Pushed 50 Escrow Orders to Cloud Database!');
  else console.warn('Cloud API status:', res.status);
}).catch(err => console.warn('Cloud sync error:', err.message));
