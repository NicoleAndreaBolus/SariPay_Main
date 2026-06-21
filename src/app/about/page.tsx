'use client';

import React from 'react';
import { 
  ShieldCheck, 
  Database, 
  Fingerprint, 
  Globe, 
  Users, 
  LineChart,
  Sparkles,
  ArrowRight,
  Zap,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/common/Button';

export default function About() {
  return (
    <main className="min-h-screen bg-gradient-to-tr from-[#0B1411] via-[#12221D] to-[#0B1411] text-[#F3F4F6] py-16 px-6 relative overflow-hidden font-sans">
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto flex flex-col gap-16 relative z-10">
        
        {/* Vision Statement Header */}
        <section className="text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-bold mb-6">
            <Sparkles className="w-3.5 h-3.5" /> Empowering Retail Merchants
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-2xl leading-tight">
            Connecting Micro-Retail to <span className="bg-gradient-to-r from-emerald-400 to-mint-400 bg-clip-text text-transparent">Digital Trust</span>
          </h1>

          <div className="mt-8 text-sm sm:text-base text-gray-400 max-w-3xl leading-relaxed flex flex-col gap-6 text-left border-l-2 border-emerald-500/30 pl-6 md:pl-8">
            <p>
              In the Philippines, millions of neighborhood **sari-sari stores** form the bedrock of the local economy. Yet, their supply chain operations remain trapped in traditional, cash-heavy frameworks. Store merchants waste precious hours preparing cash, delivery riders face security threats carrying bulk funds, and distributor systems struggle with expensive ledger reconciliation delays.
            </p>
            <p>
              **SariPay** is built to bridge this gap. By deploying secure, zero-trust escrow contracts natively on the **Stellar Soroban network**, we empower local store owners and wholesale suppliers in Pampanga to transact safely. We remove payment friction, eliminate COD cash handling security risks, and guarantee instant payouts without the premium overhead fees of traditional settlement channels.
            </p>
          </div>
        </section>

        {/* Core Technology Grid */}
        <section className="flex flex-col gap-8">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Stellar Infrastructure Layer</h2>
            <p className="text-xs text-gray-500 mt-2">Empowered by advanced ledger engineering and modern hardware security.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Soroban Engine Card */}
            <div className="bg-[#12221D] p-6 rounded-2xl border border-[#1A312A] shadow-lg flex flex-col justify-between h-full group hover:border-emerald-500/25 transition-all">
              <div>
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20 mb-5 text-emerald-400">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">Stellar Soroban Engine</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Leverages Soroban smart contracts to host isolated transaction escrows, completing ledger confirmation steps under 5 seconds with fractions of a penny in gas fees.
                </p>
              </div>
            </div>

            {/* Stablecoin Optimization Card */}
            <div className="bg-[#12221D] p-6 rounded-2xl border border-[#1A312A] shadow-lg flex flex-col justify-between h-full group hover:border-emerald-500/25 transition-all">
              <div>
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20 mb-5 text-emerald-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">Stablecoin Settlement</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Escrow values track stable asset parameters (like USDC or regulated e-money) to guarantee price stability, avoiding blockchain token volatility for business margins.
                </p>
              </div>
            </div>

            {/* Passwordless Biometrics Card */}
            <div className="bg-[#12221D] p-6 rounded-2xl border border-[#1A312A] shadow-lg flex flex-col justify-between h-full group hover:border-emerald-500/25 transition-all">
              <div>
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20 mb-5 text-emerald-400">
                  <Fingerprint className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">Passwordless Biometrics</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Secures merchant signing via hardware WebAuthn passkeys, enabling storefront owners to lock or release transaction funds using their phone fingerprint readers.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* Final call block */}
        <section className="bg-[#12221D] rounded-3xl p-8 border border-[#1A312A] text-center flex flex-col items-center gap-4 relative overflow-hidden">
          <h3 className="font-bold text-white text-lg">Ready to transform your business logistics?</h3>
          <p className="text-xs text-gray-400 max-w-sm">Join the trustless network today to secure invoices and automate collections.</p>
          <Link href="/register" passHref>
            <Button className="flex items-center gap-1.5 font-bold mt-2">
              Get Started Now <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </section>

      </div>
    </main>
  );
}
