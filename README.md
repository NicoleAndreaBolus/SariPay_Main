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

You can test the entire B2B transaction cycle directly in the browser dashboard:

1. **Verify Your Workspace**: Click the **Verify Workspace** banner at the top of the screen and complete the quick 4-step wizard. This activates your simulated account.
2. **Initialize an Order**: Stay in the **Merchant Workspace** (top switcher) and click **Create Order** (or **Place Order**). Add a supplier name and amount, then submit.
3. **Lock the Funds (Deposit)**: Tap the new order in your list and click **Fund Escrow Contract**. You will see your *Available Balance* go down and your *Funds in Escrow Trust* go up.
4. **Ship the Cargo (Supplier)**: Switch to the **Distributor Workspace** using the switcher pill at the top of the screen. Find your order in the deliveries list and click **Dispatch Cargo (Ship Order)**.
5. **Release Payout via QR**: 
   * Switch to the **Distributor Workspace** using the switcher pill at the top, select the order, and click **Show Handoff QR** (or present QR).
   * Switch back to the **Merchant Workspace**, click **Open Delivery Scanner** (bottom-right floating button or table action), and scan the Distributor's QR code (you can simulate scanning in the dialog).
   * **Result**: The transaction completes successfully because it is signed by the Merchant wallet (satisfying the contract's on-chain authorization requirement), clearing the escrow and transferring the payout to the distributor's wallet balance!

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
