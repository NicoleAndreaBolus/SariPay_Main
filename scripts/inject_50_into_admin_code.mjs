import fs from 'fs';
import path from 'path';

const seeded = JSON.parse(fs.readFileSync(path.resolve('docs', 'seeded_workspaces_50.json'), 'utf-8'));

function updateAdminFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf-8');

  // Format the 50 workspaces
  const workspacesStr = 'const DEFAULT_WORKSPACES: Workspace[] = ' + JSON.stringify(seeded.workspaces, null, 2) + ';';
  
  // Format the 50 users
  const usersStr = 'const DEFAULT_USERS: UserProfile[] = ' + JSON.stringify(seeded.users, null, 2) + ';';

  // Format the 10 orders
  const ordersStr = 'const DEFAULT_ORDERS: Order[] = ' + JSON.stringify(seeded.orders, null, 2) + ';';

  // Replace DEFAULT_WORKSPACES
  code = code.replace(/const DEFAULT_WORKSPACES: Workspace\[\] = \[[\s\S]*?\];/m, workspacesStr);
  
  // Replace DEFAULT_USERS
  code = code.replace(/const DEFAULT_USERS: UserProfile\[\] = \[[\s\S]*?\];/m, usersStr);

  // Replace DEFAULT_ORDERS
  code = code.replace(/const DEFAULT_ORDERS: Order\[\] = \[[\s\S]*?\];/m, ordersStr);

  fs.writeFileSync(filePath, code, 'utf-8');
  console.log(`Updated ${filePath} with 50 workspaces, 50 users, and 10 orders.`);
}

updateAdminFile(path.resolve('src', 'app', 'admin', 'page.tsx'));
updateAdminFile(path.resolve('saripay-frontend', 'src', 'app', 'admin', 'page.tsx'));
console.log('🎉 Admin source files updated with all 50 pilot users!');
