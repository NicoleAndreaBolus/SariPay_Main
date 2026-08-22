# SariPay Interactive Demo & Evaluation Walkthrough Script

> Comprehensive testing guide for hackathon judges and evaluators to test all features of SariPay in under 5 minutes on desktop or mobile.

---

## 🌐 Quick Access Links
* **Live Web Application:** [https://saripay.vercel.app/](https://saripay.vercel.app/)
* **Merchant Dashboard:** [https://saripay.vercel.app/dashboard/customer](https://saripay.vercel.app/dashboard/customer)
* **Distributor Dashboard:** [https://saripay.vercel.app/dashboard/supplier](https://saripay.vercel.app/dashboard/supplier)
* **Admin & Dispute Console:** [https://saripay.vercel.app/admin](https://saripay.vercel.app/admin)
* **Public GitHub Repo:** [https://github.com/NicoleAndreaBolus/SariPay_Main](https://github.com/NicoleAndreaBolus/SariPay_Main)

---

## 🎬 5-Minute Evaluation Walkthrough

### Part 1: Landing Page & Live Ledger Stream (30 Seconds)
1. Open [https://saripay.vercel.app/](https://saripay.vercel.app/).
2. Scroll to the **Live Activity Feed**:
   * Observe live block transactions and verified B2B payment hashes streaming in real-time.
   * Click any transaction hash to open its live cryptographic record on **StellarExpert**.

---

### Part 2: Merchant Restock Catalog & Smart Escrow (1 Minute)
1. Navigate to **[Customer / Merchant Dashboard](https://saripay.vercel.app/dashboard/customer)**.
2. Review the **"SariScore™" Credit Widget** at the top:
   * Displays on-chain credit score (`785/850 pts`) and available 0% interest working capital advance (`₱15,000`).
   * Click **`[⚡ Draw Restock Advance]`** to simulate an immediate capital credit into your merchant wallet.
   * Click **`[+ Top Up (PHP)]`** to test simulated GCash, Maya, or bank top-ups.
3. Click the green **`[+ New Restock Order]`** button above the purchase queue:
   * Select quantities for *Sinandomeng Rice*, *Great Taste Coffee*, or *Lucky Me Pancit Canton*.
   * Select a supplier (*Universal Robina*, *Monde Nissin*, *San Miguel*).
   * Click **"Place & Lock Escrow"** and watch the confetti celebration as the funds are locked in smart escrow!

---

### Part 3: Wholesale Supplier Dispatch & Payout Pipeline (1 Minute)
1. Navigate to **[Supplier / Distributor Dashboard](https://saripay.vercel.app/dashboard/supplier)** (or switch workspace to *Universal Robina* in the top selector).
2. Observe the **Guaranteed Payout Pipeline Banner**:
   * Shows 3-stage logistics cashflow (*Locked in Escrow ➔ Out for Delivery ➔ Settled Payouts*).
3. In the **Revenue Assurance Table**:
   * Find the newly created order in `Funded` state.
   * Click the green **`[🚚 Dispatch & Ship]`** button to advance the cargo to `In Transit`.
   * Click **`[📱 Driver Handoff QR]`** to display the QR code for the delivery driver.

---

### Part 4: Camera Delivery Verification & Instant Payout (1 Minute)
1. Switch back to the **[Merchant Dashboard](https://saripay.vercel.app/dashboard/customer)**.
2. In the Active Purchase Queue, find the `In Transit` order:
   * Click the green **`[📷 Scan Driver QR]`** button.
   * Point your camera at the driver's QR code (or use the simulated handoff button).
   * In under **3 seconds**, the smart contract verifies the cryptographic proof, releases the payout to the distributor, and displays the **Digital Delivery Receipt**!
3. Click **`[🧾 Receipt ↗]`** on any settled order to view the full cryptographic receipt and StellarExpert transaction link.

---

### Part 5: Smart Escrow Dispute Protocol & Admin Portal (1 Minute)
1. On any `Funded` or `In Transit` order in the Merchant table, click **`[⚠️ Dispute]`**.
2. Select a reason (*e.g., Damaged / Broken Inventory*), enter details, and confirm.
3. The smart contract freezes the escrow payout.
4. Open the **[Admin Console](https://saripay.vercel.app/admin)**:
   * Click the **"Disputes"** tab (Shield 🛡️ icon).
   * Inspect the newly filed dispute case, review merchant evidence, and click **`[Approve Refund to Merchant]`** to execute an on-chain refund!
