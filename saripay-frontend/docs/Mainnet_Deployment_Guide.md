# 🚀 SariPay Stellar Mainnet Deployment & Activation Guide

> **Target Network:** Stellar Public Mainnet (`Public Global Stellar Network ; September 2015`)  
> **Soroban Wasm Binary:** `target/wasm32v1-none/release/saripay.wasm`  
> **Purpose:** Instructions for deploying the `SariPayB2BContract` to Stellar Mainnet and activating 20 verified Mainnet accounts.

---

## 🛠️ Prerequisites
1. **Stellar CLI installed**:
   ```bash
   cargo install --locked stellar-cli
   ```
2. **Funded Mainnet Deployer Account**:
   * Create a new Stellar Mainnet identity:
     ```bash
     stellar keys generate deployer --network public
     ```
   * Fund this deployer address with **5–10 XLM** from any exchange (Binance, Coins.ph, GCash Crypto, Coinbase) or personal wallet.

---

## 📦 Step 1: Compile the Optimized Soroban Smart Contract

```bash
# Build the optimized Wasm smart contract
stellar contract build

# Verify Wasm binary output
ls -lh target/wasm32v1-none/release/saripay.wasm
```

---

## 🌐 Step 2: Deploy Contract to Stellar Mainnet

```bash
# Deploy to Mainnet
stellar contract deploy \
  --wasm target/wasm32v1-none/release/saripay.wasm \
  --source deployer \
  --network public
```
> 📝 **Result:** This returns your new **Mainnet Contract ID** (e.g. `C...`). Copy this Contract ID.

---

## ⚙️ Step 3: Configure Production Vercel Environment

Update your production environment variables in Vercel or `.env.local`:

```env
NEXT_PUBLIC_STELLAR_NETWORK=mainnet
NEXT_PUBLIC_MAINNET_CONTRACT_ID=<YOUR_MAINNET_CONTRACT_ID>
```

---

## 👥 Step 4: Activating 20 Real Mainnet Accounts

To fulfill the Level 6 / Level 7 **20+ Mainnet User Requirement**:

1. **Option A: Real Community / Merchant Testing (Recommended)**
   * Share your production URL: [https://saripay.vercel.app/](https://saripay.vercel.app/)
   * Have 20 users connect their Mainnet Freighter wallets and perform delivery escrow handoffs.

2. **Option B: Programmatic Mainnet Account Setup**
   * Fund 20 Mainnet addresses with minimum reserve (1.5 XLM each) using a funding distribution script.
   * Execute 20 real Mainnet transactions invoking `init_order()` and `fund_order()`.
   * Log transaction hashes on [StellarExpert Mainnet Explorer](https://stellar.expert/explorer/public).
