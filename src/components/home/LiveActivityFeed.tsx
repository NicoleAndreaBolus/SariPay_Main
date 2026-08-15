'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ExternalLink, 
  Clock, 
  ArrowUpRight, 
  CheckCircle2, 
  Lock, 
  Zap, 
  Sparkles,
  RefreshCw 
} from 'lucide-react';

export interface LiveTransaction {
  id: string;
  merchant: string;
  supplier: string;
  items: string;
  amountPhp: number;
  amountXlm: string;
  status: 'Settled' | 'In Escrow' | 'Delivering';
  timestamp: string;
  txHash: string;
  settlementTime: string;
}

const INITIAL_TRANSACTIONS: LiveTransaction[] = [
  {
    id: 'ORD-8942',
    merchant: "Maria Santos (Aling Nena's Store)",
    supplier: "Universal Robina Wholesale Hub",
    items: "5x Great Taste Coffee Boxes, 10x Piattos",
    amountPhp: 4850,
    amountXlm: "85.84",
    status: "Settled",
    timestamp: "1 min ago",
    txHash: "6a6a3af1b560dcb01001eb59aa6d58e04d5b100bbc0cbadc41b78d464e1dd6c2",
    settlementTime: "2.8s"
  },
  {
    id: 'ORD-8941',
    merchant: "Elena Reyes (Mang Tomas Grocery QC)",
    supplier: "Monde Nissin Distribution",
    items: "12x Lucky Me Pancit Canton Bundles",
    amountPhp: 3200,
    amountXlm: "56.63",
    status: "Settled",
    timestamp: "4 mins ago",
    txHash: "22ec0dab1f74d2c61b19e4e65f43c17f497c83f647a022397fc389918d270a58",
    settlementTime: "3.1s"
  },
  {
    id: 'ORD-8940',
    merchant: "Ana Mendoza (Nanay Belen Mini-Mart)",
    supplier: "San Miguel Beverage Depot",
    items: "8x Purefoods Corned Beef, 4x Magnolia Milk",
    amountPhp: 6750,
    amountXlm: "119.46",
    status: "In Escrow",
    timestamp: "8 mins ago",
    txHash: "ea77f760743eae6a4034e51c20b27a115559fa49274ec159a54bc890fc287839",
    settlementTime: "Lock Active"
  },
  {
    id: 'ORD-8939',
    merchant: "Grace Bautista (Kanto Express Store)",
    supplier: "Nestle Philippines B2B",
    items: "15x Bear Brand Milk Powder 300g",
    amountPhp: 5400,
    amountXlm: "95.57",
    status: "Settled",
    timestamp: "15 mins ago",
    txHash: "35033c38487d0adace36ebcecddfc424873212e6df6e128f27aa740f383cf308",
    settlementTime: "3.4s"
  },
  {
    id: 'ORD-8938',
    merchant: "Liza Cruz (Ate Joy Variety Store)",
    supplier: "Century Pacific Food Wholesale",
    items: "20x 555 Sardines, 10x Argentina Corned Beef",
    amountPhp: 3950,
    amountXlm: "69.91",
    status: "Settled",
    timestamp: "24 mins ago",
    txHash: "4a4e1e0c99670c5a8066cab3ac4b9be166a1e63eedd446cd5a63b5c30d610dca",
    settlementTime: "2.9s"
  }
];

export function LiveActivityFeed() {
  const [transactions, setTransactions] = useState<LiveTransaction[]>(INITIAL_TRANSACTIONS);
  const [lastUpdated, setLastUpdated] = useState<string>('Just now');

  // Simulated live pulse to give real-time vitality to the landing page
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12">
      {/* Header with Live Indicator */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-200 text-xs font-bold text-emerald-700 mb-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            LIVE ON-CHAIN ACTIVITY FEED
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Real-Time Escrow Settlements on Stellar
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-xl">
            Live proof of B2B delivery handoffs, smart escrow fund locks, and instantaneous payouts happening across micro-retailers in the Philippines.
          </p>
        </div>

        {/* Live Metrics Summary Pill */}
        <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-xs text-xs font-semibold text-slate-700 self-start md:self-auto">
          <div className="flex items-center gap-1.5 text-emerald-600">
            <Zap className="w-4 h-4 fill-emerald-500 text-emerald-500" />
            <span>Avg Finality: <strong className="text-slate-900 font-extrabold">3.1s</strong></span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1.5 text-blue-600">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Fee: <strong className="text-slate-900 font-extrabold">0.25%</strong></span>
          </div>
        </div>
      </div>

      {/* Transactions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {transactions.map((tx) => (
          <div 
            key={tx.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all duration-200 flex flex-col justify-between relative group"
          >
            <div>
              {/* Card Top Row: Order ID & Status Badge */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  {tx.id}
                </span>
                
                {tx.status === 'Settled' ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Settled ({tx.settlementTime})
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    <Lock className="w-3 h-3 text-amber-600" />
                    {tx.status}
                  </span>
                )}
              </div>

              {/* Merchant & Supplier Names */}
              <div className="mb-2">
                <div className="text-sm font-extrabold text-slate-900 line-clamp-1">{tx.merchant}</div>
                <div className="text-xs text-slate-500 line-clamp-1">From: <span className="font-medium text-slate-700">{tx.supplier}</span></div>
              </div>

              {/* Item Summary */}
              <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-4 line-clamp-1">
                📦 {tx.items}
              </div>
            </div>

            {/* Bottom Row: Amount & Explorer Link */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div>
                <span className="font-black text-slate-900 text-base">₱{tx.amountPhp.toLocaleString()}</span>
                <span className="text-[11px] font-semibold text-emerald-600 ml-1.5">({tx.amountXlm} XLM)</span>
              </div>

              <a
                href={`https://stellar.expert/explorer/testnet/tx/${tx.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-slate-400 hover:text-emerald-600 font-semibold transition-colors group-hover:text-emerald-600"
                title="View on StellarExpert Explorer"
              >
                <span>Proof</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
