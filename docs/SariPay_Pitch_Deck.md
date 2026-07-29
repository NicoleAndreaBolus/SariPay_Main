# 📊 SariPay — Pitch Deck & Strategic Overview

> **Stellar-Powered B2B Supply Chain Micro-Escrow Network for Southeast Asia**

---

## Slide 1: Title & Executive Summary
* **Product Name:** SariPay B2B
* **Tagline:** Eradicating Cash-On-Delivery Risk and Unlocking Working Capital for 1.3M Sari-Sari Stores.
* **Blockchain Infrastructure:** Built natively on Stellar Soroban Smart Contracts.
* **Core Value Proposition:** Cryptographic payment lockup upon order placement, instant 5-second QR settlement upon storefront delivery verification.

---

## Slide 2: The Problem
In Southeast Asia (specifically the Philippines), 1.3 million *Sari-Sari* corner stores handle over 60% of daily consumer goods:
1. **Cash-On-Delivery (COD) Security Risk:** Shopkeepers must hold large physical cash reserves (₱5,000–₱20,000) inside storefronts on delivery days, creating severe theft & robbery exposure.
2. **Supplier Default Risk:** Wholesale distributors lose millions annually on uncollected credit orders and failed cash collections.
3. **Slow Settlement Friction:** Bank transfers take 1–3 business days to clear, freezing supplier working capital and delaying inventory re-stocking.

---

## Slide 3: The Solution — SariPay Smart Escrow
SariPay replaces physical cash and delayed bank transfers with automated **Soroban Smart Contract Escrow**:
1. **Invoice & Escrow Lock:** Supplier issues an invoice; Merchant deposits payment into a Soroban smart contract escrow container.
2. **Guaranteed Dispatch:** The supplier sees "Funds Locked in Trust" on their dashboard and dispatches delivery trucks with 100% payment certainty.
3. **Instant QR Handoff:** Driver presents cargo handoff QR code at the shop; Merchant scans code to release funds directly to supplier wallet in under 5 seconds.

---

## Slide 4: Market Opportunity
* **Total Addressable Market (TAM):** $100B+ Informal Retail FMCG Market in Southeast Asia.
* **Serviceable Addressable Market (SAM):** $15B Annual B2B Wholesale Inventory Supply in the Philippines.
* **Serviceable Obtainable Market (SOM):** $500M Initial Pilot Volume across 50,000 Sari-Sari Stores & Top 20 FMCG Regional Distributors in Luzon.

---

## Slide 5: Technical Architecture
* **Frontend Layer:** Next.js 16 (App Router), React 19, Tailwind CSS, `@stellar/freighter-api`, Camera QR scanner (`html5-qrcode`).
* **Smart Contract Layer:** Rust Soroban Wasm smart contract (`SariPayB2BContract`) implementing cryptographic state transitions (`init_order`, `fund_order`, `confirm_delivery`, `cancel_order`).
* **Ledger & Sync Layer:** Real-time ledger polling via Stellar Horizon & Vercel Postgres synchronization.

---

## Slide 6: User Growth & Validation (Level 5 Milestones)
* **Active Onboarded Users:** 50+ Real Stellar Testnet Wallets (Merchants & Distributors).
* **On-Chain Activity:** 50+ Verified Soroban / Stellar Testnet Transactions logged on StellarExpert Explorer.
* **User Feedback Rating:** **4.8 / 5.0 Average Rating** across 50 pilot survey respondents.
* **Key User Takeaways:** 90% reduction in storefront cash risks; 100% elimination of supplier payment defaults.

---

## Slide 7: Growth Strategy & Business Model
* **Revenue Model:** 0.25% B2B Escrow Transaction Fee (95% cheaper than traditional credit card/merchant acquiring fees).
* **Distribution Channels:** Direct integration with regional FMCG distributors (Unilever, Nestlé, Procter & Gamble logistics partners).
* **Merchant Acquisition:** Referral incentives for distributor sales reps onboarding neighborhood Sari-Sari stores.

---

## Slide 8: Future Roadmap & Vision
* **Q3 2026:** Mainnet Audit & Deployment of Soroban Contracts.
* **Q4 2026:** PHPC / USDC Stablecoin Liquidity Pools & Anchor On/Off-Ramp Integration (cash-to-stablecoin conversion at pawnshops/banks).
* **Q1 2027:** Micro-Credit & Inventory Financing scoring based on on-chain escrow repayment history.
