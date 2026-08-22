# SariPay B2B

> Stellar-powered supply chain micro-escrow smart payment dApp for neighborhood merchants and wholesale FMCG distributors in Southeast Asia.

![Stellar](https://img.shields.io/badge/Stellar-Testnet_%26_Mainnet-0099C6?style=flat-square&logo=stellar&logoColor=white)
![Soroban](https://img.shields.io/badge/Soroban-Smart_Contracts-00686B?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-2F74C0?style=flat-square&logo=typescript&logoColor=white)
![Rust](https://img.shields.io/badge/Rust-1.80+-C69375?style=flat-square&logo=rust&logoColor=white)
[![Twitter/X](https://img.shields.io/badge/X-@saripaymain-black?logo=x&style=flat-square)](https://x.com/saripaymain)

---

## 🌐 Production Deployment & Master Submission Index

* **LIVE MVP DEMO:** [https://saripay.vercel.app/](https://saripay.vercel.app/)
* **GITHUB REPOSITORY:** [https://github.com/NicoleAndreaBolus/SariPay_Main](https://github.com/NicoleAndreaBolus/SariPay_Main)
* **OFFICIAL TWITTER / X PROFILE:** [https://x.com/saripaymain](https://x.com/saripaymain)
* **USER ONBOARDING GOOGLE FORM:** [SariPay User Onboarding & Feedback Form](https://docs.google.com/forms/d/e/1FAIpQLSfAgWKEPQVmYBdMK6Ig-d3g2bWNFwPcD1e1-8woHez_3Vg8sw/viewform)
* **PUBLIC GOOGLE SHEETS RESPONSES:** [SariPay Onboarding Responses (Google Sheets)](https://docs.google.com/spreadsheets/d/1BMG8YuL83RXhQrLHQFCj6hDyVKFSXRSg8chhIHgqBaA/edit?usp=sharing)
* **LOCAL EXCEL/CSV DATASET:** [user_feedback_responses.csv](user_feedback_responses.csv) | [docs/user_feedback_responses.csv](docs/user_feedback_responses.csv)
* **LAUNCH USERS AUDIT LEDGER (50 USERS):** [LAUNCH_USERS.md](LAUNCH_USERS.md) | [FEEDBACK.md](FEEDBACK.md)
* **PITCH DECK / PRESENTATION:** [PITCH_DECK.md](PITCH_DECK.md) | [docs/SariPay_Pitch_Deck.md](docs/SariPay_Pitch_Deck.md)
* **INTERACTIVE DEMO WALKTHROUGH SCRIPT:** [DEMO_SCRIPT.md](DEMO_SCRIPT.md) | [TWITTER_LAUNCH.md](TWITTER_LAUNCH.md)
* **FOUNDER MONTHLY GROWTH REPORT (LEVEL 7):** [MONTHLY_GROWTH_REPORT.md](MONTHLY_GROWTH_REPORT.md) | [docs/Monthly_Growth_Report.md](docs/Monthly_Growth_Report.md)
* **SOCIAL MEDIA GROWTH KIT & PRODUCT POSTS:** [SOCIAL_GROWTH_STRATEGY.md](SOCIAL_GROWTH_STRATEGY.md) | [docs/Social_Media_Growth_Kit.md](docs/Social_Media_Growth_Kit.md)
* **SMART CONTRACT SECURITY AUDIT:** [SECURITY_AUDIT.md](SECURITY_AUDIT.md) | [docs/SariPay_Security_Audit.md](docs/SariPay_Security_Audit.md)
* **ECOSYSTEM TECHNICAL TUTORIAL:** [TUTORIAL.md](TUTORIAL.md) | [docs/SariPay_Developer_Tutorial.md](docs/SariPay_Developer_Tutorial.md)
* **MAINNET DEPLOYMENT GUIDE:** [docs/Mainnet_Deployment_Guide.md](docs/Mainnet_Deployment_Guide.md)
* **MAINNET TRANSACTION RECORDS:** [mainnet_payment_transactions.json](mainnet_payment_transactions.json) | [docs/mainnet_payment_transactions.json](docs/mainnet_payment_transactions.json)
* **LIVE ON-CHAIN LANDING FEED:** [src/components/home/LiveActivityFeed.tsx](src/components/home/LiveActivityFeed.tsx)
* **ADVANCED FEATURE (BLACK BELT - LEVEL 6):** [Gasless Fee Sponsorship Relayer](src/services/feeSponsorship.ts)
* **LEVEL 5 FEATURE COMMIT (Restock Catalog & SariScore):** [Commit `528c91f`](https://github.com/NicoleAndreaBolus/SariPay_Main/commit/528c91f)
* **LEVEL 6 FEATURE COMMIT (Fee Sponsorship & Mainnet):** [Commit `15d961e`](https://github.com/NicoleAndreaBolus/SariPay_Main/commit/15d961e)
* **LEVEL 7 FEATURE COMMIT (50 Mainnet Transactions):** [Commit `7545eb4`](https://github.com/NicoleAndreaBolus/SariPay_Main/commit/7545eb4)
* **SUPPLIER UX UPGRADE COMMIT (Payout Pipeline & Auto-Fill):** [Commit `f1e2474`](https://github.com/NicoleAndreaBolus/SariPay_Main/commit/f1e2474)
* **DISPUTE & SECURITY COMMIT (On-Chain Dispute Protocol):** [Commit `2b209a2`](https://github.com/NicoleAndreaBolus/SariPay_Main/commit/2b209a2)
* **SOROBAN CONTRACT ID:** `CDCYQTQY5TETNSKHGNCJQXDPEUTDAQY4AONAQQPTBLICTDVAVE3VOPDU`
* **CONTRACT EXPLORER:** [stellar.expert/explorer/testnet/contract/CDCYQTQY5TETNSKHGNCJQXDPEUTDAQY4AONAQQPTBLICTDVAVE3VOPDU](https://stellar.expert/explorer/testnet/contract/CDCYQTQY5TETNSKHGNCJQXDPEUTDAQY4AONAQQPTBLICTDVAVE3VOPDU)

---

## 📸 Product Screenshots & Visual Walkthrough Gallery

### 1. Merchant Dashboard & Real-Time Wallet Balances (PHP & XLM)
![Merchant Dashboard](docs/screenshots/merchant_dashboard.png)

*Figure 1: Merchant Viewport showcasing real-time wallet balances (PHP & XLM), active purchase order queue, settlement states, and instant QR delivery verification controls.*

### 2. Mobile-First Responsive Experience
![Mobile Viewport](docs/screenshots/mobile_view.png)

*Figure 2: Mobile Viewport optimized for store owners, featuring bottom tab navigation, quick action cards, recent escrow history, and floating QR camera scanner.*

### 3. Smart Contract Explorer & On-Chain Ledger Proof
![StellarExpert Contract Explorer](docs/screenshots/contract_explorer.png)

*Figure 3: Live StellarExpert Testnet Explorer verifying active Soroban smart contract WASM deployment (`CDCYQTQY...`) and recent on-chain contract executions (`init_order`, `fund_order`, `confirm_delivery`).*

### 4. Vercel Real-Time Analytics & Monitoring Telemetry
![Vercel Analytics & Monitoring Logs](docs/screenshots/vercel_analytics.png)

*Figure 4: Production monitoring dashboard on Vercel tracking real-time HTTP 200 telemetry, active `/api/sync` state transactions, and system health status.*

---

## 🟡 Level 2 (Yellow Belt) Verification & Deliverables

* **4 Error Types Explicitly Handled**:
  1. **Invalid/Malformed Address Error**: Validates base32 StrKey Ed25519 format with automatic whitespace trimming before simulation.
  2. **Insufficient Merchant Balance**: Pre-validates wallet balance against the required restocking escrow amount before prompting Freighter signature.
  3. **Unauthorized Delivery Confirmation**: Enforces cryptographic buyer authorization guards in Soroban smart contract (`contracts/SariPay/src/lib.rs`), preventing non-buyer addresses from releasing funds.
  4. **Unfunded Order Delivery Exception**: Prevents courier dispatch or delivery confirmation if the order has not been locked in smart escrow.
* **Contract Deployed on Testnet**: `CDCYQTQY5TETNSKHGNCJQXDPEUTDAQY4AONAQQPTBLICTDVAVE3VOPDU`
* **Contract Called from Frontend**: Implemented via `@stellar/stellar-sdk` and `@stellar/freighter-api` in `src/hooks/useSariPayContract.ts`.
* **Transaction Status Visible**: Toast alerts, status badges, progress loaders, and direct StellarExpert links.
* **Sample Verified Contract Interaction Tx**: [`6a6a3af1b560dcb01001eb59aa6d58e04d5b100bbc0cbadc41b78d464e1dd6c2`](https://stellar.expert/explorer/testnet/tx/6a6a3af1b560dcb01001eb59aa6d58e04d5b100bbc0cbadc41b78d464e1dd6c2)

---

## 🟠 Level 3 (Orange Belt) Verification & Deliverables

* **Advanced Smart Contract Architecture**:
  * **Inter-Contract Communication**: Uses Soroban SAC Token Client (`token::Client`) to execute locked escrow transfers and payout releases in a single atomic transaction.
  * **Event Streaming & Real-Time Updates**: Home page [`LiveActivityFeed.tsx`](src/components/home/LiveActivityFeed.tsx) and live balance polling from Stellar Horizon RPC.
* **Camera-Based Hardware Integration**: Real-time mobile video feed scanner ([`QRScannerModal.tsx`](src/components/dashboard/QRScannerModal.tsx)) for instant physical-to-digital retail proof-of-delivery.
* **Mobile-First Responsive Layout**: Built with fluid Tailwind grids, touch-friendly UI components, and mobile drawer navigation.
* **Interactive Walkthrough Script**: Documented in [`DEMO_SCRIPT.md`](DEMO_SCRIPT.md) and [`TWITTER_LAUNCH.md`](TWITTER_LAUNCH.md).

---

## 🟢 Level 4 (Green Belt) Verification & Deliverables

* **Production MVP Deployment**: Live on Vercel at [https://saripay.vercel.app/](https://saripay.vercel.app/).
* **Proof of 10+ Real User Wallet Interactions**: Top 10 verified participants logged below with authentic on-chain transactions:

| User # | Participant Name | Role / Store | Stellar Wallet Address | On-Chain Transaction Hash | Explorer Link |
| :-: | :--- | :--- | :--- | :--- | :-: |
| **1** | Nicole Bolus | Merchant (Retailer) | `GCISQDTKEEUGE5KUH7O7EEGKGTM7ZIVRABL275BOCSQNXPXTFIEX7UMO` | `e1fea6a9a7a4f93e97098750f9c3d44b993ec5d5c53db22b4165178017145652` | [View Tx](https://stellar.expert/explorer/testnet/tx/e1fea6a9a7a4f93e97098750f9c3d44b993ec5d5c53db22b4165178017145652) |
| **2** | Bradley Manalese | Distributor (Supplier) | `GBALNCR7WABCJSTVQJVYX72GN2ASTE7GZG5WZMDVMOLCPDZEBZ76Y35V` | `035d9edba9ea60d61567a23008418aa99d3cb98d20b87c30c96cc246b7998d82` | [View Tx](https://stellar.expert/explorer/testnet/tx/035d9edba9ea60d61567a23008418aa99d3cb98d20b87c30c96cc246b7998d82) |
| **3** | Calvin Jared Quiambao | Merchant (Retailer) | `GAFYVG6BMZEPSQSZSHWJWQANNVNVMAF65HDGBBEEUC7FWTMZOC7ZL2T3` | `74150a79032c6616e278edd532ed2242097a31e5429f6c57f2cddf981b03a715` | [View Tx](https://stellar.expert/explorer/testnet/tx/74150a79032c6616e278edd532ed2242097a31e5429f6c57f2cddf981b03a715) |
| **4** | Kaze Nyx | Distributor (Supplier) | `GCTIXPA2EU3W34BIG7S6PSVJUZS2VORP2B7QJGMZLKS2OA26WP2GTJ2A` | `11270614914ca1f17995d4c715735cd48078d3f39a772e98a85d850a03b5f1da` | [View Tx](https://stellar.expert/explorer/testnet/tx/11270614914ca1f17995d4c715735cd48078d3f39a772e98a85d850a03b5f1da) |
| **5** | Jose Miguel Garcia | Merchant (Retailer) | `GBLZIIPNP54YEPAQQD7XY66XNRF2H6D75ZJRYD6SG3KVCGI7UEKAEDJ5` | `57422522c7f2c4a269fbd04283609161cbefe545ee2b8925c3a1c45dcf52a6b2` | [View Tx](https://stellar.expert/explorer/testnet/tx/57422522c7f2c4a269fbd04283609161cbefe545ee2b8925c3a1c45dcf52a6b2) |
| **6** | Damiel Fyodor | Distributor (Supplier) | `GBSRMIVV4XRLOOAFNZAHA72OIHLRUZEI2V2GGHPX6PSVU65MB4MPXCJF` | `5cb1631ebcb83d24e75c12acb6785ffa8ef63e747af8a1ec2da6108c7ea028b2` | [View Tx](https://stellar.expert/explorer/testnet/tx/5cb1631ebcb83d24e75c12acb6785ffa8ef63e747af8a1ec2da6108c7ea028b2) |
| **7** | Elena Reyes | Merchant (Retailer) | `GC4HFMWIDH6YIERH6XQFCIWJLBIYGOUOKHXBHHABADWYQAQQRLXWIXZW` | `1aafe3870dca9037a8a689607b7594f7bca821b999703df6aaef4d24ee7020ad` | [View Tx](https://stellar.expert/explorer/testnet/tx/1aafe3870dca9037a8a689607b7594f7bca821b999703df6aaef4d24ee7020ad) |
| **8** | Roberto Garcia | Distributor (Supplier) | `GCXNS2GIHSCYQIUSV6S6WGTSSFGZOZDYEODGBLY6O6NUAJYIWALSFJJW` | `7e93afca825726056bb9e3f8c651b53077112a7f25ecb7ecda83735f8f7bbd0e` | [View Tx](https://stellar.expert/explorer/testnet/tx/7e93afca825726056bb9e3f8c651b53077112a7f25ecb7ecda83735f8f7bbd0e) |
| **9** | Ana Mendoza | Merchant (Retailer) | `GBJEY254WBDZMGRVLAVIG44TDCNRGA53XW76NVQ7VIVTUUX6OE35OKWF` | `7b51af760851193bb28b1f6a29380dbe8750c3279caff91174cb10d4aae79bd7` | [View Tx](https://stellar.expert/explorer/testnet/tx/7b51af760851193bb28b1f6a29380dbe8750c3279caff91174cb10d4aae79bd7) |
| **10** | Carlos Ramos | Distributor (Supplier) | `GB2RVIWIGUPXV7RNAUHGZQTVPZQNGOE35YAOYOB63AOOJE2MGKIJUVTQ` | `ec952311287ccf780d1fb9011d5b4fdc05571be29b742babe8365f501c23fefc` | [View Tx](https://stellar.expert/explorer/testnet/tx/ec952311287ccf780d1fb9011d5b4fdc05571be29b742babe8365f501c23fefc) |
| ... | *(Rows 11 to 50)* | *Full Record in CSV* | *50 Distinct StrKey Public Keys* | *50 Valid 64-char Hex Proofs* | [Download Full 50 CSV](docs/user_feedback_responses.csv) |

---

## 🔵 Level 5 (Blue Belt) Verification & Deliverables

### 1. 🔄 11 Feedback-Driven Product Improvements

Based on pilot user survey responses from our 50 onboarded merchants and suppliers, we implemented key UX, financial, and operational features directly into the codebase:

1. **1-Click Wholesale Restock Catalog Modal ([`RestockCatalogModal.tsx`](src/components/dashboard/RestockCatalogModal.tsx))**:
   * *User Feedback (Nicole B. & Maria Santos)*: *"Manually typing product names and calculating XLM exchange rates for daily stockups takes too long when customers are waiting."*
   * *Implemented Feature*: Built an interactive wholesale catalog with 8 fast-moving staple FMCG goods featuring real-time PHP/XLM math, supplier picker, and 1-click Soroban escrow locking.
   * *Git Commit Link*: [Commit `528c91f`](https://github.com/NicoleAndreaBolus/SariPay_Main/commit/528c91f)

2. **"SariScore™" On-Chain Micro-Credit & Fiat Top-Up Card ([`SariScoreWidget.tsx`](src/components/dashboard/SariScoreWidget.tsx) & [`TopUpModal.tsx`](src/components/dashboard/TopUpModal.tsx))**:
   * *User Feedback (Elena Reyes & Ana Mendoza)*: *"We need working capital advances to restock inventory before payday without borrowing from informal 20% interest lenders. Also need GCash/Maya deposit options."*
   * *Implemented Feature*: Built a dynamic on-chain credit score engine (300–850 pts) unlocking up to ₱25,000 in zero-interest working capital restocking lines, paired with simulated GCash, Maya, and BDO/BPI fiat deposits.
   * *Git Commit Link*: [Commit `528c91f`](https://github.com/NicoleAndreaBolus/SariPay_Main/commit/528c91f)

3. **Guaranteed Payout Pipeline & Quick Merchant Auto-Fill ([`UnifiedDashboard.tsx`](src/components/dashboard/UnifiedDashboard.tsx))**:
   * *User Feedback (Santos Wholesale & Manuel Ortiz)*: *"Warehouse managers need to see at a glance that payment is 100% locked before loading delivery trucks, and auto-fill store addresses when creating invoices."*
   * *Implemented Feature*: Added a 3-stage visual logistics cashflow status banner (*Locked in Escrow ➔ Out for Delivery ➔ Settled Payouts*) and a 1-click registered merchant auto-fill dropdown with wholesale package presets.
   * *Git Commit Link*: [Commit `f1e2474`](https://github.com/NicoleAndreaBolus/SariPay_Main/commit/f1e2474)

4. **Real-Time Mobile Camera QR Scanner ([`QRScannerModal.tsx`](src/components/dashboard/QRScannerModal.tsx))**:
   * *User Feedback (Juan Dela Cruz)*: *"Delivery drivers need to use their phone camera directly at the store counter to verify physical handoff in under 3 seconds."*
   * *Implemented Feature*: Integrated HTML5 camera video scanner that reads physical driver QR codes and triggers instant on-chain escrow payout settlement.
   * *Git Commit Link*: [Commit `49c9332`](https://github.com/NicoleAndreaBolus/SariPay_Main/commit/49c9332)

5. **Smart Escrow Dispute Resolution & Refund Protocol ([`DisputeModal.tsx`](src/components/dashboard/DisputeModal.tsx))**:
   * *User Feedback (Teresa Aquino)*: *"What happens if goods arrive crushed, dented, or missing from the truck? We need a way to freeze the escrow and request a merchant refund."*
   * *Implemented Feature*: Built a formal dispute submission protocol that freezes contract payouts on-chain and routes incident claims directly to the Admin Resolution Center (`/admin`).
   * *Git Commit Links*: [Commit `2b209a2`](https://github.com/NicoleAndreaBolus/SariPay_Main/commit/2b209a2) & [Commit `102dda1`](https://github.com/NicoleAndreaBolus/SariPay_Main/commit/102dda1)

6. **Cryptographic Digital Delivery Receipt & Proof Modal ([`DeliveryReceiptModal.tsx`](src/components/dashboard/DeliveryReceiptModal.tsx))**:
   * *User Feedback (Carlos Ramos)*: *"Both the store owner and the driver need an official digital delivery receipt with on-chain transaction hashes for daily accounting."*
   * *Implemented Feature*: Created a cryptographic delivery receipt modal displaying the Stellar transaction hash, itemized cargo, timestamp, and clickable StellarExpert proof link.
   * *Git Commit Link*: [Commit `6bf7e89`](https://github.com/NicoleAndreaBolus/SariPay_Main/commit/6bf7e89)

7. **Live On-Chain Activity Feed on Homepage ([`LiveActivityFeed.tsx`](src/components/home/LiveActivityFeed.tsx))**:
   * *User Feedback (David Gomez)*: *"We want to see live blockchain settlements happening in real-time to trust that the platform is active."*
   * *Implemented Feature*: Live activity ticker on the landing page connecting directly to Stellar Horizon testnet/mainnet feeds.
   * *Git Commit Link*: [Commit `49c9332`](https://github.com/NicoleAndreaBolus/SariPay_Main/commit/49c9332)

8. **Gasless Fee Sponsorship (Stellar CAP-0015 Protocol) ([`src/services/feeSponsorship.ts`](src/services/feeSponsorship.ts))**:
   * *User Feedback*: *"Micro-merchants do not hold native XLM gas reserves and should not have to pay transaction fees."*
   * *Implemented Feature*: Built a sponsored relayer pool using native Stellar `FeeBumpTransaction` mechanics to pay 100% of network fees on behalf of merchants.
   * *Git Commit Link*: [Commit `15d961e`](https://github.com/NicoleAndreaBolus/SariPay_Main/commit/15d961e)

9. **Real-Time Currency Converter & Escrow Fee Calculator ([`CurrencyConverter.tsx`](src/components/dashboard/CurrencyConverter.tsx))**:
   * *User Feedback (Elena Reyes)*: *"Please show exact Philippine Peso conversions updated from live market rates before locking money into escrow."*
   * *Implemented Feature*: Integrated CoinGecko Simple Price API fetching live XLM/PHP market rates with a 0.25% protocol fee estimator.
   * *Git Commit Link*: [Commit `afdaba8`](https://github.com/NicoleAndreaBolus/SariPay_Main/commit/afdaba8)

10. **Input Sanitization & Trailing Whitespace Trimming**:
    * *User Feedback*: *"Copying wallet addresses or order IDs on mobile keyboards sometimes adds trailing spaces, causing validation errors."*
    * *Implemented Feature*: Automatic `.trim()` sanitization across all input fields, contract addresses, and import order searches.

11. **Centralized Admin Console & Multi-Workspace Manager ([`admin/page.tsx`](src/app/admin/page.tsx))**:
    * *User Feedback*: *"Platform administrators need a dashboard to monitor all 50 pilot accounts, audit contract state, and arbitrate open dispute cases."*
    * *Implemented Feature*: Enterprise Admin Portal with full dispute arbitration tools, 50 merchant & distributor workspaces, and live escrow ledger monitoring.
    * *Git Commit Link*: [Commit `d4f332d`](https://github.com/NicoleAndreaBolus/SariPay_Main/commit/d4f332d)

---

### 2. 🗺️ Next Phase Evolution & Future Roadmap (Feedback-Driven)

1. **Phase 1: Automated Inventory AI Restock Alerts (Q4 2026)**
   * Store point-of-sale scanner predicting FMCG stock depletion and auto-generating escrow drafts.
2. **Phase 2: Decentralized Supplier Credit Staking Pools (Q1 2027)**
   * Wholesale suppliers staking SAC liquidity pools to earn 8% APY while funding merchant restocks.
3. **Phase 3: Cross-Border ASEAN Micro-Remittance Settlement (Q2 2027)**
   * Enabling overseas Filipino workers (OFWs) to fund sari-sari store restocks directly via Stellar USDC/EURC rails.

---

## ⚡ Level 6 (Black Belt Track): Gasless Fee Sponsorship (Stellar CAP-0015)

To eliminate friction for non-crypto-native neighborhood store owners (*Sari-Sari* merchants), SariPay implements **Stellar Fee Sponsorship (Gasless Transactions)** using native `FeeBumpTransaction` mechanics (CAP-0015):

* **How It Works:** The merchant constructs and signs their supply escrow funding or delivery transaction. Before on-chain broadcast, the SariPay relayer service wraps the transaction into a Fee-Bump envelope via `buildSponsoredFeeBumpTx()`, paying all network gas fees on behalf of the merchant.
* **Verified Sponsor Address:** `GCCY5TQ262GIYZDRRYENCSWUJXT3THBQQ42RINCESXTYZMGTL2NJM4SE` (Funded on Public Mainnet & Testnet).
* **Result:** Store owners never need to acquire or hold reserve XLM to pay gas fees—achieving a seamless Web2-like user experience powered by Web3 smart contracts.
* **Implementation Source:** [`src/services/feeSponsorship.ts`](src/services/feeSponsorship.ts)

---

## 🚀 Level 7 (Founder Belt): Startup Traction & Verified Mainnet Transactions

SariPay is designed as a sustainable Web3 B2B fintech enterprise solving Cash-On-Delivery risks for 1.3 million *Sari-Sari* stores. Complete metrics, financial models, and telemetry are documented in [MONTHLY_GROWTH_REPORT.md](MONTHLY_GROWTH_REPORT.md):

* **Verified Mainnet Proof:** **50 Real Transactions on Stellar Public Mainnet** with `SARIPAY:ORD-XXXX` B2B escrow memos on [StellarExpert Public Mainnet Explorer](https://stellar.expert/explorer/public/account/GCCY5TQ262GIYZDRRYENCSWUJXT3THBQQ42RINCESXTYZMGTL2NJM4SE) ([`mainnet_payment_transactions.json`](mainnet_payment_transactions.json)).

| # | B2B Order Memo | Pilot User / Store | Role | Mainnet Transaction Hash | Live Mainnet Explorer Link |
| :-: | :--- | :--- | :--- | :--- | :-: |
| **1** | `SARIPAY:ORD-8950` | Nicole Bolus | Merchant (Retailer) | `b1f11fe0bfffbcc9473918284fe8f5f0c3b3b74a41059c9b9d615b9def440c68` | [View on Mainnet](https://stellar.expert/explorer/public/tx/b1f11fe0bfffbcc9473918284fe8f5f0c3b3b74a41059c9b9d615b9def440c68) |
| **2** | `SARIPAY:ORD-8949` | Bradley Manalese | Distributor (Supplier) | `4c7b94d783724698b16ccf5b25cf4d5ddadf51618887844773d1e25f6bd22ec6` | [View on Mainnet](https://stellar.expert/explorer/public/tx/4c7b94d783724698b16ccf5b25cf4d5ddadf51618887844773d1e25f6bd22ec6) |
| **3** | `SARIPAY:ORD-8948` | Calvin Jared Quiambao | Merchant (Retailer) | `15578814afe8637198c4c57815a0a4cfab962c935cdac5d691a7a9fb367c976d` | [View on Mainnet](https://stellar.expert/explorer/public/tx/15578814afe8637198c4c57815a0a4cfab962c935cdac5d691a7a9fb367c976d) |
| **4** | `SARIPAY:ORD-8947` | Kaze Nyx | Distributor (Supplier) | `fdba3c15ce189fb6e84096effa9da558942afb9736eda0269f5f82b93e6a2824` | [View on Mainnet](https://stellar.expert/explorer/public/tx/fdba3c15ce189fb6e84096effa9da558942afb9736eda0269f5f82b93e6a2824) |
| **5** | `SARIPAY:ORD-8946` | Jose Miguel Garcia | Merchant (Retailer) | `4bcfecf1bc8704e8fe7dd6e87fc730c525bc0f9698a190dc293bb30843cd5c22` | [View on Mainnet](https://stellar.expert/explorer/public/tx/4bcfecf1bc8704e8fe7dd6e87fc730c525bc0f9698a190dc293bb30843cd5c22) |
| **6** | `SARIPAY:ORD-8945` | Damiel Fyodor | Distributor (Supplier) | `14518f20292f2210e1c8e9a811afd56a2d34467e744c34974115fa59339d9b12` | [View on Mainnet](https://stellar.expert/explorer/public/tx/14518f20292f2210e1c8e9a811afd56a2d34467e744c34974115fa59339d9b12) |
| **7** | `SARIPAY:ORD-8944` | Elena Reyes | Merchant (Retailer) | `e62f0c45144ad430db3337cb4332c96a571f6bfab68bdb13556758bccb250bb6` | [View on Mainnet](https://stellar.expert/explorer/public/tx/e62f0c45144ad430db3337cb4332c96a571f6bfab68bdb13556758bccb250bb6) |
| **8** | `SARIPAY:ORD-8943` | Roberto Garcia | Distributor (Supplier) | `479cdd6ecadc469258378194691400dd3d224c5b49fd5d30d1e9bc0f1e933c02` | [View on Mainnet](https://stellar.expert/explorer/public/tx/479cdd6ecadc469258378194691400dd3d224c5b49fd5d30d1e9bc0f1e933c02) |
| **9** | `SARIPAY:ORD-8942` | Ana Mendoza | Merchant (Retailer) | `3828d0eb112c15301f07a00b74d623a3cebc25c77ef74a95a85a8b899209c215` | [View on Mainnet](https://stellar.expert/explorer/public/tx/3828d0eb112c15301f07a00b74d623a3cebc25c77ef74a95a85a8b899209c215) |
| **10** | `SARIPAY:ORD-8941` | Carlos Ramos | Distributor (Supplier) | `726d5e34c3cd8fd2876e42176ba9451f5102a24e9eb25341be2cde4925962fbe` | [View on Mainnet](https://stellar.expert/explorer/public/tx/726d5e34c3cd8fd2876e42176ba9451f5102a24e9eb25341be2cde4925962fbe) |
| ... | *(Rows 11 to 50)* | *Full Record in Mainnet JSON* | *50 Verified Mainnet Transactions* | *50 Valid Hashes* | [Download Full 50 Mainnet JSON](mainnet_payment_transactions.json) |
* **Monetization Model:** 
  * *Starter Merchant:* 0.25% protocol fee per settled delivery escrow.
  * *Enterprise Supplier ($29/mo):* Guaranteed Payout Pipeline, instant driver QR generation, automated dispute mediation, and accounting export.
* **Official Social Media Channel:** [https://x.com/saripaymain](https://x.com/saripaymain) (Social Growth Strategy in [SOCIAL_GROWTH_STRATEGY.md](SOCIAL_GROWTH_STRATEGY.md) and [TWITTER_LAUNCH.md](TWITTER_LAUNCH.md)).

---

## 🛡️ Smart Contract Architecture & Security Audit

The SariPay Soroban smart contract is built with Rust and verified for mathematical precision and buyer authentication guards:

* **Source Code:** [`contracts/SariPay/src/lib.rs`](contracts/SariPay/src/lib.rs)
* **Security Audit Document:** [`SECURITY_AUDIT.md`](SECURITY_AUDIT.md) | [`docs/SariPay_Security_Audit.md`](docs/SariPay_Security_Audit.md)
* **Developer Ecosystem Tutorial:** [`TUTORIAL.md`](TUTORIAL.md) | [`docs/SariPay_Developer_Tutorial.md`](docs/SariPay_Developer_Tutorial.md)
* **Mainnet Deployment Guide:** [`docs/Mainnet_Deployment_Guide.md`](docs/Mainnet_Deployment_Guide.md)

```rust
// Core Buyer Authorization Guard & Payout Release (Soroban Rust)
pub fn confirm_delivery(env: Env, order_id: u128) -> Result<(), Error> {
    let mut order: Order = env.storage().instance().get(&DataKey::Order(order_id))
        .ok_or(Error::OrderNotFound)?;
    
    // Cryptographic guard: Only the merchant buyer can authorize payout release
    order.merchant.require_auth();
    
    if order.status != OrderStatus::Funded && order.status != OrderStatus::InTransit {
        return Err(Error::InvalidStatus);
    }
    
    order.status = OrderStatus::Delivered;
    env.storage().instance().set(&DataKey::Order(order_id), &order);
    
    // Transfer locked escrow funds from contract vault to distributor
    let token_client = token::Client::new(&env, &order.token);
    token_client.transfer(&env.current_contract_address(), &order.distributor, &order.amount);
    
    Ok(())
}
```

---

## 🔐 Accessing the Admin & Dispute Resolution Portal

* **Path to access**: Navigate to [`/admin`](https://saripay.vercel.app/admin) in the dApp.
* **Dispute Arbitration**: Click the **"Disputes"** tab (Shield 🛡️ icon) to inspect evidence and execute on-chain refunds.

---

## 🛠️ Technical Prerequisites & Local Setup

### 1. Prerequisites
* **Node.js** `v18.0+`
* **Rust** `v1.80+`
* **Target** `wasm32-unknown-unknown`
* **Freighter Wallet Extension**

### 2. Local Setup
```bash
# Install dependencies
npm install

# Run local Next.js development server
npm run dev

# Build production bundle
npm run build
```
