'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  CreditCard, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Wallet, 
  RefreshCw, 
  Lock,
  Building2,
  Store,
  Info
} from 'lucide-react';
import { Button } from '@/components/common/Button';
import { LogoLockup } from '@/components/common/Logo';
import { useStellarWallet } from '@/hooks/useStellarWallet';

export default function CreditPage() {
  const { walletAddress } = useStellarWallet();

  const [activeTab, setActiveTab] = useState<'merchant' | 'supplier'>('merchant');

  // Merchant Loan Calculator State
  const [loanAmountPhp, setLoanAmountPhp] = useState<number>(15000);
  const [loanDays, setLoanDays] = useState<number>(14);
  const [isDrawingLoan, setIsDrawingLoan] = useState<boolean>(false);
  const [loanSuccess, setLoanSuccess] = useState<boolean>(false);

  // Supplier Staking State
  const [stakeAmountXlm, setStakeAmountXlm] = useState<string>('500');
  const [isStaking, setIsStaking] = useState<boolean>(false);
  const [stakeSuccess, setStakeSuccess] = useState<boolean>(false);
  const [stakedBalance, setStakedBalance] = useState<number>(2450);
  const [accumulatedYield, setAccumulatedYield] = useState<number>(38.45);

  const loanAmountXlm = (loanAmountPhp * 0.155).toFixed(2);
  const loanSharkCostPhp = (loanAmountPhp * 0.20).toFixed(0);
  const sariPaySavingsPhp = loanSharkCostPhp;

  const handleDrawCredit = () => {
    setIsDrawingLoan(true);
    setTimeout(() => {
      setIsDrawingLoan(false);
      setLoanSuccess(true);
      setTimeout(() => setLoanSuccess(false), 5000);
    }, 1500);
  };

  const handleStakeLiquidity = () => {
    if (!stakeAmountXlm || Number(stakeAmountXlm) <= 0) return;
    setIsStaking(true);
    setTimeout(() => {
      setIsStaking(false);
      setStakedBalance(prev => prev + Number(stakeAmountXlm));
      setStakeSuccess(true);
      setStakeAmountXlm('');
      setTimeout(() => setStakeSuccess(false), 5000);
    }, 1500);
  };

  const handleClaimYield = () => {
    alert(`Successfully claimed ${accumulatedYield.toFixed(2)} XLM yield to wallet!`);
    setAccumulatedYield(0);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 selection:bg-emerald-500 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <LogoLockup size={36} />
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <Link href="/dashboard/customer" className="hover:text-emerald-400 transition-colors">Merchant Dashboard</Link>
            <Link href="/dashboard/supplier" className="hover:text-emerald-400 transition-colors">Distributor Dashboard</Link>
            <Link href="/inventory" className="hover:text-emerald-400 transition-colors">Smart Inventory</Link>
            <Link href="/credit" className="text-emerald-400 font-semibold flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              SariCredit™
            </Link>
            <Link href="/admin" className="hover:text-emerald-400 transition-colors">Admin</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/dashboard/customer">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-900/20">
                Launch App
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="relative overflow-hidden pt-12 pb-16 px-6 border-b border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Stellar Soroban Decentralized Credit & Staking
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            SariCredit™ Liquidity & Working Capital
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Zero-interest inventory micro-loans for sari-sari merchants, powered by decentralized supplier liquidity staking yielding <strong className="text-emerald-400">8.75% APY</strong> on Stellar.
          </p>

          {/* Mode Switcher */}
          <div className="inline-flex p-1.5 bg-slate-800/80 rounded-2xl border border-slate-700 mt-6 shadow-xl">
            <button
              onClick={() => setActiveTab('merchant')}
              className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${
                activeTab === 'merchant'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Store className="w-4 h-4" />
              For Merchants (Draw Capital)
            </button>
            <button
              onClick={() => setActiveTab('supplier')}
              className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${
                activeTab === 'supplier'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              For Suppliers (Stake & Earn 8.75% APY)
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {activeTab === 'merchant' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: SariScore Overview Card */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" /> On-Chain Credit Identity
                  </span>
                  <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full font-mono border border-emerald-500/20">
                    Tier A • Prime
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-slate-400">Current SariScore™</div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl font-black text-white tracking-tight">785</span>
                    <span className="text-slate-500 text-sm font-semibold">/ 850 pts</span>
                  </div>
                </div>

                {/* Gauge Meter */}
                <div className="mt-4 space-y-2">
                  <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full w-[92%] transition-all duration-1000" />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                    <span>300 (Poor)</span>
                    <span>650 (Good)</span>
                    <span>850 (Excellent)</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 p-3.5 rounded-2xl border border-slate-700/50">
                    <div className="text-[11px] text-slate-400">Available Advance</div>
                    <div className="text-xl font-bold text-emerald-400 mt-0.5">₱25,000</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">~3,875 XLM</div>
                  </div>
                  <div className="bg-slate-800/50 p-3.5 rounded-2xl border border-slate-700/50">
                    <div className="text-[11px] text-slate-400">Escrow Success Rate</div>
                    <div className="text-xl font-bold text-white mt-0.5">100%</div>
                    <div className="text-[10px] text-emerald-400 font-mono mt-0.5">50/50 Completed</div>
                  </div>
                </div>

                <div className="mt-6 space-y-2.5 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Instant automatic lock into wholesale FMCG escrows</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>0.0% APR promotional rate sponsored by FMCG distributors</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Auto-repaid upon retail customer daily cash sales</span>
                  </div>
                </div>
              </div>

              {/* Informal Loan Shark Comparison Alert */}
              <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 rounded-3xl p-5 text-amber-200">
                <div className="flex items-center gap-2 font-bold text-sm text-amber-400 mb-1.5">
                  <Info className="w-4 h-4" />
                  SariPay vs. Traditional "5-6" Lenders
                </div>
                <p className="text-xs text-amber-300/80 leading-relaxed">
                  Informal lenders charge <strong>20% monthly interest (₱3,000 fee on ₱15,000)</strong>. With SariPay's on-chain Soroban micro-escrow, you save <strong className="text-white">₱{sariPaySavingsPhp}</strong> in interest fees every single restock cycle!
                </p>
              </div>
            </div>

            {/* Right Column: Loan Configurator & Restock Trigger */}
            <div className="lg:col-span-7">
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <CreditCard className="w-6 h-6 text-emerald-400" />
                    Draw Working Capital Advance
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">
                    Select your inventory restocking budget. Funds are locked directly into a smart escrow with your chosen distributor.
                  </p>
                </div>

                {/* Amount Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <label className="text-sm font-semibold text-slate-300">Restock Loan Amount</label>
                    <div className="text-right">
                      <span className="text-2xl font-black text-emerald-400">₱{loanAmountPhp.toLocaleString()}</span>
                      <span className="text-xs text-slate-500 ml-2 font-mono">({loanAmountXlm} XLM)</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min={2000}
                    max={25000}
                    step={1000}
                    value={loanAmountPhp}
                    onChange={(e) => setLoanAmountPhp(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="flex justify-between text-xs text-slate-500 font-mono">
                    <span>₱2,000 (Min)</span>
                    <span>₱10,000</span>
                    <span>₱25,000 (Max Limit)</span>
                  </div>
                </div>

                {/* Term Selector */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-300">Repayment Term</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[7, 14, 30].map((days) => (
                      <button
                        key={days}
                        onClick={() => setLoanDays(days)}
                        className={`p-3.5 rounded-2xl border text-center font-bold text-sm transition-all ${
                          loanDays === days
                            ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-950/40'
                            : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:border-slate-600'
                        }`}
                      >
                        {days} Days
                        <span className="block text-[11px] font-normal text-slate-500 mt-0.5">0.0% APR</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Summary Table */}
                <div className="bg-slate-800/40 rounded-2xl p-5 border border-slate-700/50 space-y-3 text-sm">
                  <div className="flex justify-between text-slate-400">
                    <span>Principal Draw</span>
                    <span className="font-semibold text-white">₱{loanAmountPhp.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Interest & Financing Fee</span>
                    <span className="font-semibold text-emerald-400">₱0.00 (Sponsored by Universal Robina)</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Escrow Lock Destination</span>
                    <span className="font-mono text-xs text-slate-300">Universal Robina FMCG Depot</span>
                  </div>
                  <div className="pt-3 border-t border-slate-700/60 flex justify-between text-base font-bold text-white">
                    <span>Total Repayable in {loanDays} Days</span>
                    <span className="text-emerald-400">₱{loanAmountPhp.toLocaleString()}</span>
                  </div>
                </div>

                {/* Action CTA */}
                {loanSuccess ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl flex items-center gap-3 text-emerald-300 text-sm font-semibold">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>Advance approved! ₱{loanAmountPhp.toLocaleString()} has been locked into wholesale restock escrow.</span>
                  </div>
                ) : (
                  <Button
                    onClick={handleDrawCredit}
                    disabled={isDrawingLoan}
                    className="w-full py-4 text-base bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-xl shadow-emerald-900/30 flex items-center justify-center gap-2"
                  >
                    {isDrawingLoan ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Simulating Soroban Escrow Lock...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Confirm & Lock ₱{loanAmountPhp.toLocaleString()} Restock Advance
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Pool Metrics & Staking Controls */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                      <Layers className="w-6 h-6 text-emerald-400" />
                      SariPay Wholesale Liquidity Pool
                    </h2>
                    <span className="text-xs bg-emerald-500/10 text-emerald-400 font-mono font-bold px-3 py-1 rounded-full border border-emerald-500/20">
                      8.75% APY
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mt-1">
                    Deposit XLM or USDC to finance micro-merchant inventory advances and earn protocol escrow settlement fees.
                  </p>
                </div>

                {/* Staking Input */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-300">Amount to Stake (XLM)</label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="e.g. 500"
                      value={stakeAmountXlm}
                      onChange={(e) => setStakeAmountXlm(e.target.value)}
                      className="w-full bg-slate-800/80 border border-slate-700 rounded-2xl px-4 py-3.5 text-lg font-mono font-bold text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                    <button
                      onClick={() => setStakeAmountXlm('1000')}
                      className="absolute right-3 top-3 text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold px-3 py-1.5 rounded-lg transition-colors"
                    >
                      MAX
                    </button>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Est. Annual Earnings (8.75%):</span>
                    <span className="text-emerald-400 font-bold font-mono">
                      +{(Number(stakeAmountXlm || 0) * 0.0875).toFixed(2)} XLM / year
                    </span>
                  </div>
                </div>

                {/* Staking Action */}
                {stakeSuccess ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl flex items-center gap-3 text-emerald-300 text-sm font-semibold">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>Stake successful! You are now earning 8.75% APY on Stellar.</span>
                  </div>
                ) : (
                  <Button
                    onClick={handleStakeLiquidity}
                    disabled={isStaking || !stakeAmountXlm || Number(stakeAmountXlm) <= 0}
                    className="w-full py-4 text-base bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-xl shadow-emerald-900/30 flex items-center justify-center gap-2"
                  >
                    {isStaking ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Depositing into Soroban Liquidity Pool...
                      </>
                    ) : (
                      <>
                        <Wallet className="w-5 h-5" />
                        Stake Liquidity & Start Earning
                      </>
                    )}
                  </Button>
                )}

                {/* Protocol Security Safeguard Note */}
                <div className="border-t border-slate-800 pt-5 flex items-start gap-3 text-xs text-slate-400">
                  <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    100% Principal Protection: All loans are locked into delivery escrows with verified merchants and released only upon physical camera QR handoff.
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Supplier Yield & Portfolio Overview */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Your Staking Position</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>

                <div className="space-y-1">
                  <div className="text-sm text-slate-400">Total Staked Principal</div>
                  <div className="text-3xl font-black text-white font-mono">{stakedBalance.toLocaleString()} XLM</div>
                  <div className="text-xs text-slate-500">≈ ₱{(stakedBalance * 6.25).toLocaleString()} PHP</div>
                </div>

                <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">Accumulated Staking Yield</span>
                    <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      Real-time
                    </span>
                  </div>
                  <div className="text-2xl font-black text-emerald-400 font-mono">
                    +{accumulatedYield.toFixed(2)} XLM
                  </div>
                  <Button
                    onClick={handleClaimYield}
                    disabled={accumulatedYield <= 0}
                    size="sm"
                    className="w-full bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold py-2 rounded-xl"
                  >
                    Claim Yield to Wallet
                  </Button>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-800 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>Pool Total Value Locked (TVL)</span>
                    <span className="font-mono text-white font-semibold">185,420 XLM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Funded Store Restocks</span>
                    <span className="font-mono text-white font-semibold">25 Stores</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Historical Default Rate</span>
                    <span className="font-mono text-emerald-400 font-semibold">0.00%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
