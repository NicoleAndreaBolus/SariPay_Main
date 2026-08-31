'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  CheckCircle2, 
  Wallet, 
  Printer, 
  Share2, 
  ExternalLink, 
  ShieldCheck, 
  RefreshCw, 
  Building2, 
  Store, 
  Lock
} from 'lucide-react';
import { Button } from '@/components/common/Button';
import { LogoLockup } from '@/components/common/Logo';
import confetti from 'canvas-confetti';

interface LineItem {
  sku: string;
  name: string;
  qty: number;
  unitPricePhp: number;
}

export default function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const orderId = unwrappedParams.id || 'ORD-8950';

  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paying' | 'paid'>('pending');
  const [selectedToken, setSelectedToken] = useState<'XLM' | 'USDC'>('XLM');
  const [copied, setCopied] = useState(false);

  const lineItems: LineItem[] = [
    { sku: 'FMCG-RC-01', name: 'Sinandomeng Premium Rice 25kg Sack', qty: 4, unitPricePhp: 1250 },
    { sku: 'FMCG-CF-02', name: 'Great Taste White Coffee (Pack of 100)', qty: 3, unitPricePhp: 550 },
    { sku: 'FMCG-NC-03', name: 'Lucky Me! Pancit Canton (Box of 72)', qty: 2, unitPricePhp: 850 },
    { sku: 'FMCG-SD-04', name: '555 Sardines Tomato Sauce (Box of 50)', qty: 1, unitPricePhp: 1100 }
  ];

  const subtotalPhp = lineItems.reduce((acc, item) => acc + (item.qty * item.unitPricePhp), 0);
  const wholesaleDiscountPhp = 450;
  const escrowFeePhp = (subtotalPhp * 0.0025);
  const totalPhp = subtotalPhp - wholesaleDiscountPhp + escrowFeePhp;

  const totalXlm = (totalPhp * 0.16).toFixed(2);
  const totalUsdc = (totalPhp / 56).toFixed(2);

  const txHash = 'b1f11fe0bfffbcc9473918284fe8f5f0c3b3b74a41059c9b9d615b9def440c68';

  const handlePayInvoice = () => {
    setPaymentStatus('paying');
    setTimeout(() => {
      setPaymentStatus('paid');
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }, 1800);
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 selection:bg-emerald-500 selection:text-white pb-16">
      {/* Top Bar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40 print:hidden">
        <div className="max-w-5xl mx-auto px-6 h-18 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <LogoLockup size={32} />
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyLink}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border border-slate-700 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              {copied ? 'Link Copied!' : 'Share Invoice'}
            </button>
            <button
              onClick={handlePrint}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border border-slate-700 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Receipt
            </button>
          </div>
        </div>
      </header>

      {/* Main Invoice Container */}
      <main className="max-w-4xl mx-auto px-6 pt-10">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl space-y-8 relative overflow-hidden print:border-none print:shadow-none print:p-0">
          {/* Status Ribbon */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 uppercase">
                  B2B Escrow Invoice
                </span>
                <span className="text-xs font-mono text-slate-500">#{orderId}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-2">
                Official Supply Replenishment Order
              </h1>
            </div>

            <div className="text-left sm:text-right">
              {paymentStatus === 'paid' ? (
                <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-4 py-1.5 rounded-full text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Locked in Soroban Escrow
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 px-4 py-1.5 rounded-full text-xs font-bold">
                  <Lock className="w-4 h-4 text-amber-400" />
                  Awaiting Escrow Funding
                </div>
              )}
            </div>
          </div>

          {/* Supplier & Store Header Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 text-sm">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-emerald-400" /> Issued By (Distributor)
              </span>
              <div className="font-bold text-white text-base">Universal Robina FMCG Depot</div>
              <div className="text-xs text-slate-400">Warehouse Hub #4, Pasig City</div>
              <div className="text-xs font-mono text-slate-500 truncate">Account: GCCY5TQ262GIYZDRRY...M4SE</div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-emerald-400" /> Billed To (Store Retailer)
              </span>
              <div className="font-bold text-white text-base">Aling Nena's Sari-Sari Store</div>
              <div className="text-xs text-slate-400">Branch: Brgy. San Antonio, Pasig City</div>
              <div className="text-xs font-mono text-slate-500 truncate">Store ID: STORE-8950 (Maria Santos)</div>
            </div>
          </div>

          {/* Itemized Line Items Table */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              Itemized Inventory Manifest
            </h3>

            <div className="border border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-800/80 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">SKU / Item Description</th>
                    <th className="p-3.5 text-center">Qty</th>
                    <th className="p-3.5 text-right">Unit Price (PHP)</th>
                    <th className="p-3.5 text-right">Total (PHP)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {lineItems.map((item) => (
                    <tr key={item.sku} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-white">{item.name}</div>
                        <div className="text-[10px] font-mono text-slate-500">{item.sku}</div>
                      </td>
                      <td className="p-3.5 text-center font-mono font-bold">{item.qty}</td>
                      <td className="p-3.5 text-right font-mono">₱{item.unitPricePhp.toLocaleString()}</td>
                      <td className="p-3.5 text-right font-mono font-bold text-white">
                        ₱{(item.qty * item.unitPricePhp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pricing Calculation Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {/* Blockchain Settlement Details */}
            <div className="bg-slate-800/30 p-5 rounded-2xl border border-slate-800 space-y-3 text-xs">
              <div className="font-bold text-slate-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Stellar Soroban Escrow Invariant
              </div>
              <p className="text-slate-400 leading-relaxed">
                Funds are held in a decentralized Soroban smart contract escrow (<code className="text-emerald-400 font-mono">CDCYQTQY...</code>). Payment is released only when the merchant scans the physical delivery driver QR code upon unloading.
              </p>
              {paymentStatus === 'paid' && (
                <div className="pt-2 border-t border-slate-700/60">
                  <span className="text-[10px] text-slate-500 font-mono block">Verified On-Chain Tx:</span>
                  <a
                    href={`https://stellar.expert/explorer/public/tx/${txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 font-mono text-[11px] hover:underline flex items-center gap-1 truncate"
                  >
                    {txHash.substring(0, 32)}...
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="font-mono text-white">₱{subtotalPhp.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>Wholesale Tier Discount (5%)</span>
                <span className="font-mono">-₱{wholesaleDiscountPhp.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>SariPay Escrow Fee (0.25%)</span>
                <span className="font-mono text-slate-300">+₱{escrowFeePhp.toFixed(2)}</span>
              </div>
              <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
                <span className="text-base font-bold text-white">Total Amount Due</span>
                <div className="text-right">
                  <div className="text-2xl font-black text-emerald-400">₱{totalPhp.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                  <div className="text-xs font-mono text-slate-400">
                    ≈ {totalXlm} XLM / ${totalUsdc} USDC
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Execution CTA */}
          <div className="pt-6 border-t border-slate-800 print:hidden space-y-4">
            {paymentStatus === 'paid' ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-white text-base">Escrow Funded & Locked Successfully!</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  The distributor has received cargo dispatch notification. Payout will settle when the delivery truck arrives.
                </p>
                <div className="pt-2">
                  <Link href="/dashboard/customer">
                    <Button size="sm" className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold">
                      Return to Merchant Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Select Payment Currency:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedToken('XLM')}
                      className={`px-3 py-1 rounded-lg font-bold font-mono transition-colors ${
                        selectedToken === 'XLM' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      XLM ({totalXlm} XLM)
                    </button>
                    <button
                      onClick={() => setSelectedToken('USDC')}
                      className={`px-3 py-1 rounded-lg font-bold font-mono transition-colors ${
                        selectedToken === 'USDC' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      USDC (${totalUsdc} USDC)
                    </button>
                  </div>
                </div>

                <Button
                  onClick={handlePayInvoice}
                  disabled={paymentStatus === 'paying'}
                  className="w-full py-4 text-base bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-xl shadow-emerald-950/40 flex items-center justify-center gap-2"
                >
                  {paymentStatus === 'paying' ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Broadcasting Soroban Escrow Lock...
                    </>
                  ) : (
                    <>
                      <Wallet className="w-5 h-5" />
                      Lock ₱{totalPhp.toLocaleString(undefined, { maximumFractionDigits: 2 })} into Smart Escrow
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
