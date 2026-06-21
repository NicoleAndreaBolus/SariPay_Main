# SariPay B2B

> Stellar-powered supply chain micro-escrow smart payment dApp for neighborhood merchants in Southeast Asia.

![Stellar](https://img.shields.io/badge/Stellar-Testnet-0099C6?style=flat-square&logo=stellar&logoColor=white)
![Soroban](https://img.shields.io/badge/Soroban-Smart_Contracts-00686B?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-2F74C0?style=flat-square&logo=typescript&logoColor=white)
![Rust](https://img.shields.io/badge/Rust-1.80+-C69375?style=flat-square&logo=rust&logoColor=white)

---

## 🔗 Ledger Info (Stellar Testnet)
* **CONTRACT ID:** `CDCYQTQY5TETNSKHGNCJQXDPEUTDAQY4AONAQQPTBLICTDVAVE3VOPDU`
* **CONTRACT EXPLORER:** [stellar.expert/contract/CDCYQTQY5TETNSKHGNCJQXDPEUTDAQY4AONAQQPTBLICTDVAVE3VOPDU](https://stellar.expert/explorer/testnet/contract/CDCYQTQY5TETNSKHGNCJQXDPEUTDAQY4AONAQQPTBLICTDVAVE3VOPDU)

---

## 📖 Project Description
SariPay B2B is a decentralized, secure supply chain micro-escrow smart payment dApp optimized for small shop owners (sari-sari stores) and informal neighborhood merchants in Southeast Asia. 

### The Problem
Traditional B2B retail supply chains face massive friction. Cash-On-Delivery (COD) creates safety risks for delivery drivers and requires store owners to keep large amounts of physical cash on hand. Standard bank transfers, on the other hand, take days to clear, leading to delayed inventory stockups and frozen working capital.

### The Solution
SariPay B2B solves this by locking commercial payments into a secure, transparent, on-chain Soroban escrow contract at the moment of order placement. This signals the distributor/supplier that the funds are secured in trust, allowing them to confidently dispatch goods. Once delivery is completed at the storefront, a simple QR handoff scans and releases the locked funds to the supplier instantly.

---

## 🚀 Key Features

### 1. Dual Workspace Viewports
* **Merchant (Retailer) Workspace**:
  * View Available Wallet Balances (XLM & equivalent PHP values).
  * Deposit/Lock payment funds safely inside the Soroban smart contract.
  * Scan the Distributor's Handoff QR Code using their camera/wallet to confirm delivery receipt and authorize on-chain escrow release.
* **Distributor (Supplier) Workspace**:
  * Track "Guaranteed Revenue" locked in active escrow trust (escrow trust deducts and moves to available balance when settled).
  * Dispatch pending orders and track cargo transit statuses.
  * Show/Generate the Cargo Handoff QR Code for the Merchant to scan.

### 2. Mobile-First Responsive Experience
* **Bottom Navigation Menu**: Highly visible tabs (`Home`, `Orders`, `Wallet`, `Alerts`, `Profile`) designed for one-handed operation.
* **Responsive Metrical Cards**: Stacked metric ledger display with horizontal swipe gestures for secondary data on smaller mobile screens.
* **Fluid Sheets**: Dynamic modal bottom-sheets that slide up to present order details and workspace options smoothly.
* **KYC Onboarding Wizard**: A step-by-step business verification workflow (Business Info, Documents, Review, Submit) designed to easily onboard new retailers.

### 3. Smart Contract Verification Workflow
* **Wasm Smart Contract Engine**: Full implementation of cryptographic orders (`init_order`, `fund_order`, `confirm_delivery`, `cancel_order`) ensuring trustless fund handling.
* **Ledger Synchronization**: Real-time blockchain ledger polling to keep state in sync across both distributor and merchant devices.

---

## 🤝 How It Works (Simplified)

SariPay eliminates the need for physical cash or delayed bank transfers during B2B supply chain deliveries through a simple 4-stage process:

1. **Order Invoice Issued**: The supplier creates an order invoice.
2. **Funds Locked (Trust)**: The merchant funds the order. The money is securely locked inside an isolated blockchain escrow container. The supplier sees that the funds are secured, but cannot withdraw them yet.
3. **Dispatch & Cargo Transit**: Confident that payment is secured, the supplier ships the cargo to the merchant store.
4. **QR Handoff & Release**: When the delivery driver arrives, the driver presents the package/cargo handoff QR code. The Merchant scans it. Because the smart contract escrow requires authorization from the funding party (the Merchant), scanning triggers the transaction using the Merchant's wallet signature, instantly releasing the payout to the supplier in under 5 seconds.

---

## 💻 How to Run a Simulation Test (Step-by-Step)

You can test the entire B2B transaction cycle either **on a single device** (using the workspace switcher at the top) or **across two separate devices** (e.g., a phone and a laptop) using Vercel Postgres live sync:

### Option A: Cross-Device Flow (Recommended - Real B2B Experience)

1. **Setup Merchant (Device A - e.g., Phone/Retailer)**:
   * Open SariPay, click **Connect Wallet** (connect your Merchant wallet, e.g., Freighter key `GCCY5TQ...`), or use the Mock/Passkey.
   * Go to the workspace dropdown, select/create a **Merchant** workspace, and click the **Verify Workspace** banner to complete onboarding review (makes status 'Verified').
   * Copy the Merchant's Stellar wallet address shown in the dashboard.

2. **Setup Distributor (Device B - e.g., Laptop/Supplier)**:
   * Open SariPay, connect your Distributor wallet (e.g., Freighter key `GD5ST...`), or select the Distributor Mock/Passkey.
   * Create/Onboard a **Distributor** workspace (e.g., "Santos Distribution") and complete the compliance verification to make it 'Verified'.

3. **Issue Invoice (Device B - Distributor)**:
   * In the Distributor dashboard, click **Register Supply Invoice**.
   * Paste the Merchant's wallet address from Device A, enter an amount (e.g., `100` XLM), and enter shipment details. Submit the invoice. This initializes the order on-chain and in the database.
   * Take note of the generated **Order ID** (e.g., `#20845`).

4. **Import & Fund Escrow (Device A - Merchant)**:
   * In the Merchant dashboard, type the **Order ID** into the "Import Order" search input and click **Import**.
   * Select the imported order and click **Fund Escrow Contract** (prompts wallet signature). The merchant's wallet balance is locked into the escrow.

5. **Ship Order (Device B - Distributor)**:
   * The distributor dashboard will automatically update to show the order status is now `Funded`.
   * Click **Ship Order** (updates status to `In Transit`).

6. **Delivery QR Handoff & Release (Handoff)**:
   * **On Device B (Distributor)**: Tap the order and click **Show Handoff QR** to display the cargo verification QR code.
   * **On Device A (Merchant)**: Click the **Scan Delivery QR** button (or bottom FAB scanner), and scan the QR code displayed on the Distributor's screen.
   * **On Device A (Merchant)**: The scanner will prompt the Merchant to sign the delivery confirmation transaction. Once approved, the smart contract automatically releases the escrow payment directly to the distributor's wallet on-chain!

---

### Option B: Single-Device Simulation (Fast Testing)

1. **Onboard & Select Workspace**: Switch to the **Merchant** workspace view at the top, verify your workspace, and copy your wallet address.
2. **Onboard Distributor**: Switch to the **Distributor** workspace view, verify it, and click **Register Supply Invoice**. Paste your Merchant wallet address, enter an amount, and submit. Copy the new Order ID.
3. **Import & Deposit**: Switch back to the **Merchant** viewport, enter the Order ID in the "Import" box, select it, and click **Fund Escrow Contract**.
4. **Ship**: Switch to the **Distributor** viewport and click **Ship Order** on the order card.
5. **Release**: 
   * In the **Distributor** viewport, click **Show Handoff QR** to display the code.
   * Switch to the **Merchant** viewport, click the floating **Scan Delivery QR** scanner button, and click **Simulate Success Scan** to verify delivery.
   * **Result**: Payout is released on-chain and moves from the merchant's trust to the distributor's wallet balance!

---

## 🛡️ Accessing the Admin Portal (Compliance & Audit)

The Admin Portal is a desktop-only dashboard that compliance officers use to audit transactions, resolve active disputes, and verify incoming merchant or distributor onboarding requests.

* **Path to access**: Navigate to `/admin` (e.g., [http://localhost:3000/admin](http://localhost:3000/admin))
* **Default Credentials**:
  * **Email**: `admin@saripay.co`
  * **Password**: `admin`

---

## 🛠️ Technical Prerequisites
To build and deploy the smart contracts locally:
* **Rust** `v1.84.0+`
* Target compiler `wasm32v1-none`
* **Stellar CLI** installed locally

---

## 🏃 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

### 3. Build & Test Smart Contracts
```bash
# Compile contracts to Wasm
stellar contract build

# Run unit tests
cargo test
```
