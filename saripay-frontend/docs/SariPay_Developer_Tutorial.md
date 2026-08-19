# 📚 Developer Tutorial: Building B2B Supply Chain Escrow on Stellar Soroban

> **Author:** Nicole Andrea Bolus / SariPay Team  
> **Target Audience:** Web3 Developers, Rust Engineers, and Stellar Ecosystem Builders

---

## 🎯 Overview
In this tutorial, you will learn how to build a decentralized, micro-escrow smart payment network on Stellar using **Soroban Rust Smart Contracts** and **Next.js**.

---

## 🛠️ Prerequisites
* Rust `v1.80+` & target `wasm32v1-none`
* Stellar CLI installed (`cargo install --locked stellar-cli`)
* Node.js `v20+` & `@stellar/stellar-sdk`

---

## 1. Writing the Soroban Smart Contract (Rust)

Below is the complete escrow state machine structure:

```rust
#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, token, Address, Env};

#[contracttype]
#[derive(Clone, Copy, Debug, PartialEq)]
pub enum OrderStatus {
    Initialized = 0,
    Funded = 1,
    Delivered = 2,
    Canceled = 3,
}

#[contracttype]
pub struct SupplyOrder {
    pub merchant: Address,
    pub distributor: Address,
    pub token: Address,
    pub amount: i128,
    pub status: OrderStatus,
}
```

---

## 2. Deploying to Stellar Testnet & Mainnet

```bash
# 1. Build Wasm binary
stellar contract build

# 2. Deploy contract to Stellar Testnet
stellar contract deploy \
  --wasm target/wasm32v1-none/release/saripay.wasm \
  --source merchant_key \
  --network testnet
```

---

## 3. Connecting Next.js Frontend via Freighter Wallet

```typescript
import { isConnected, getAddress, setAllowed } from '@stellar/freighter-api';

export async function connectWallet() {
  await setAllowed();
  const { address } = await getAddress();
  return address;
}
```

---

## 🚀 Conclusion
By combining Soroban smart contract escrow with sub-second Stellar finality, developers can build fraud-proof B2B supply chain payment systems for micro-merchants worldwide!
