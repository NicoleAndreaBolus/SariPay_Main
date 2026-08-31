'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FileText, 
  ArrowRight, 
  Building2, 
  Store, 
  ExternalLink,
  Plus,
  Sparkles,
  QrCode
} from 'lucide-react';
import { Button } from '@/components/common/Button';
import { LogoLockup } from '@/components/common/Logo';

export default function InvoicesDirectoryPage() {
  const sampleInvoices = [
    {
      id: 'ORD-8950',
      store: "Aling Nena's Sari-Sari Store",
      supplier: 'Universal Robina FMCG Depot',
      amountPhp: 6766.88,
      amountXlm: '1,082.70',
      status: 'Ready for Escrow Lock',
      date: 'Aug 31, 2026'
    },
    {
      id: 'ORD-8949',
      store: 'Mang Tomas Grocery',
      supplier: 'Santos Wholesale Supply',
      amountPhp: 4850.00,
      amountXlm: '776.00',
      status: 'Locked in Escrow',
      date: 'Aug 30, 2026'
    },
    {
      id: 'ORD-8948',
      store: 'Nanay Belen Mini-Mart',
      supplier: 'Monde Nissin Distribution',
      amountPhp: 3400.00,
      amountXlm: '544.00',
      status: 'Delivered & Settled',
      date: 'Aug 29, 2026'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 selection:bg-emerald-500 selection:text-white">
      {/* Top Bar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <LogoLockup size={36} />
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <Link href="/dashboard/customer" className="hover:text-emerald-400 transition-colors">Merchant Dashboard</Link>
            <Link href="/dashboard/supplier" className="hover:text-emerald-400 transition-colors">Distributor Dashboard</Link>
            <Link href="/inventory" className="hover:text-emerald-400 transition-colors">Smart Inventory</Link>
            <Link href="/credit" className="hover:text-emerald-400 transition-colors">SariCredit™</Link>
            <Link href="/invoice" className="text-emerald-400 font-semibold flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
              <FileText className="w-3.5 h-3.5" />
              Invoicing
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/dashboard/supplier">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-900/20">
                Create Invoice
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12 space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1 rounded-full text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Hosted Web3 Checkout Portal
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            B2B Smart Escrow Invoices
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Direct shareable payment portals for wholesale orders on Stellar. Click any invoice to open the live checkout page.
          </p>
        </div>

        {/* Invoices List */}
        <div className="grid grid-cols-1 gap-4">
          {sampleInvoices.map((inv) => (
            <Link
              key={inv.id}
              href={`/invoice/${inv.id}`}
              className="bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 p-6 rounded-3xl transition-all duration-200 hover:shadow-xl hover:shadow-emerald-950/20 flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    {inv.id}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">{inv.date}</span>
                </div>
                <div className="font-bold text-white text-base group-hover:text-emerald-300 transition-colors">
                  {inv.store}
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Building2 className="w-3 h-3 text-slate-500" />
                  Supplier: {inv.supplier}
                </div>
              </div>

              <div className="flex items-center gap-6 justify-between md:justify-end">
                <div className="text-left md:text-right">
                  <div className="text-lg font-bold text-white font-mono">
                    ₱{inv.amountPhp.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-xs text-slate-500 font-mono">
                    ≈ {inv.amountXlm} XLM
                  </div>
                </div>

                <div className="w-10 h-10 rounded-2xl bg-slate-800 group-hover:bg-emerald-600 flex items-center justify-center text-slate-400 group-hover:text-white transition-all">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
