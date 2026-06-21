'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Shield, 
  QrCode, 
  Wallet, 
  Key, 
  Cpu, 
  TrendingUp, 
  Clock, 
  Truck, 
  Lock, 
  CheckCircle2, 
  ArrowRight, 
  Fingerprint, 
  Smartphone, 
  Laptop, 
  ChevronRight, 
  ScanLine, 
  RefreshCw, 
  FileText, 
  MapPin, 
  Users, 
  Award,
  DollarSign,
  Activity,
  UserCheck2,
  LockKeyhole,
  CheckCircle,
  HelpCircle,
  Play,
  Star,
  Quote,
  ShieldAlert,
  Zap,
  Handshake
} from 'lucide-react';
import { Button } from '@/components/common/Button';

export default function Home() {
  const router = useRouter();
  const [activeDashboardTab, setActiveDashboardTab] = useState<'merchant' | 'supplier'>('merchant');
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);

  const handleGetStarted = () => {
    router.push('/login');
  };

  const handleRequestDemo = () => {
    router.push('/login');
  };

  return (
    <main className="min-h-screen bg-[#FAFAF9] text-[#111827] flex flex-col items-center overflow-x-hidden font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="w-full max-w-7xl mx-auto px-6 pt-16 pb-24 md:pt-24 md:pb-32 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative">
        {/* Subtle Decorative Background Gradients */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#059669]/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-[#10B981]/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Hero Left Content */}
        <div className="lg:col-span-6 flex flex-col items-start text-left z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#059669]/10 rounded-full border border-[#059669]/20 text-xs font-semibold text-[#059669] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
            SariPay Escrow & Verification Network
          </div>

          {/* Manrope ExtraBold for Hero Headlines */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#111827] leading-[1.15] mb-6 font-display">
            Secure Payments.<br />
            <span className="text-[#059669]">Verified Deliveries.</span>
          </h1>

          {/* Manrope Regular for Supporting Text */}
          <p className="text-base sm:text-lg text-[#6B7280] font-normal leading-relaxed mb-10 max-w-xl">
            SariPay protects every transaction through secure escrow payments and QR-verified delivery confirmation, giving merchants and distributors complete confidence from warehouse to storefront.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            {/* Manrope SemiBold for Card Titles/CTA text */}
            <Button
              onClick={handleGetStarted}
              className="px-8 py-3.5 bg-[#059669] hover:bg-[#10B981] text-white text-sm font-semibold shadow-md shadow-[#059669]/15 flex items-center justify-center gap-2.5 rounded-xl hover:translate-y-[-1px] transition-all"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              onClick={handleRequestDemo}
              className="px-8 py-3.5 bg-white text-[#111827] border border-[#E5E7EB] text-sm font-semibold flex items-center justify-center gap-2.5 rounded-xl hover:bg-stone-50 hover:translate-y-[-1px] transition-all"
            >
              Request Demo
            </Button>
          </div>

          {/* Simple quick validation stats */}
          <div className="grid grid-cols-2 gap-8 mt-12 pt-8 border-t border-[#E5E7EB] w-full">
            <div>
              <p className="text-2xl font-bold text-[#111827]">99.9%</p>
              <p className="text-xs text-[#6B7280] font-normal mt-1">Settlement Success Rate</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#111827]">₱50M+</p>
              <p className="text-xs text-[#6B7280] font-normal mt-1">Total Volume Secured</p>
            </div>
          </div>
        </div>

        {/* Hero Right Visual (Mockup Dashboard & Overlapping Device) */}
        <div className="lg:col-span-6 relative flex justify-center items-center w-full z-10">
          
          {/* Laptop Mockup Box */}
          <div className="w-full max-w-[540px] bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl overflow-hidden relative transition-all duration-500 hover:shadow-emerald-900/5">
            {/* Header controls bar */}
            <div className="bg-[#FAFAF9] border-b border-[#E5E7EB] px-4 py-3 flex items-center justify-between">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-400/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-400/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-green-400/80 inline-block" />
              </div>
              <div className="text-[10px] text-[#6B7280] font-mono bg-white px-6 py-0.5 rounded-md border border-[#E5E7EB] select-none">
                dashboard.saripay.co/escrow
              </div>
              <div className="w-10" />
            </div>

            {/* Dashboard Workspace Mock Content */}
            <div className="p-6 bg-[#FAFAF9]/30 grid grid-cols-12 gap-5 text-left">
              {/* Left inner Sidebar */}
              <div className="col-span-3 border-r border-[#E5E7EB]/80 pr-4 flex flex-col gap-3.5 hidden sm:flex">
                <div className="w-8 h-8 rounded-lg bg-[#059669]/10 flex items-center justify-center mb-2">
                  <span className="text-[#059669] font-bold text-xs">SP</span>
                </div>
                <div className="h-3 w-16 bg-[#059669]/10 rounded-full" />
                <div className="h-2 w-14 bg-[#E5E7EB] rounded-full" />
                <div className="h-2 w-12 bg-[#E5E7EB] rounded-full" />
                <div className="h-2 w-16 bg-[#E5E7EB] rounded-full" />
                <div className="mt-auto h-2 w-10 bg-[#E5E7EB] rounded-full" />
              </div>

              {/* Main content pane */}
              <div className="col-span-12 sm:col-span-9 flex flex-col gap-5">
                {/* Dashboard Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-sm">
                    <span className="text-[9px] font-bold text-[#6B7280] uppercase tracking-wider block">Available Balance</span>
                    <span className="text-lg font-bold text-[#111827] mt-1 block">₱345,200.00</span>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-sm relative overflow-hidden">
                    <span className="text-[9px] font-bold text-[#6B7280] uppercase tracking-wider block">Funds in Trust</span>
                    <span className="text-lg font-bold text-[#059669] mt-1 block">₱124,500.00</span>
                    <span className="absolute top-3 right-3 text-[9px] bg-[#059669]/10 text-[#059669] px-2 py-0.5 rounded-full font-semibold border border-[#059669]/10">Escrow</span>
                  </div>
                </div>

                {/* Active Orders Section */}
                <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-sm flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-[#111827]">Active Escrow Orders</span>
                    <span className="text-[10px] text-[#6B7280] font-mono">2 pending verification</span>
                  </div>
                  
                  {/* Order 1 */}
                  <div className="flex justify-between items-center p-2 rounded-lg bg-[#FAFAF9] border border-[#E5E7EB] text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#059669]/10 flex items-center justify-center text-[#059669]">
                        <Truck className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="font-bold text-[#111827]">Order #98425</p>
                        <p className="text-[9px] text-[#6B7280]">Universal Distributors Inc.</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#111827]">₱84,200.00</p>
                      <span className="inline-flex items-center gap-1 text-[9px] text-amber-600 bg-amber-50 border border-amber-200/50 px-1.5 py-0.2 rounded-full font-medium">
                        Pending QR Handoff
                      </span>
                    </div>
                  </div>
                </div>

                {/* Delivery verification status check */}
                <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-sm flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <ScanLine className="w-4 h-4 text-[#059669] animate-pulse" />
                    <span className="text-[#6B7280] font-normal">Verification Network Status:</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#059669] bg-[#059669]/10 px-2 py-0.5 rounded-full border border-[#059669]/20 font-bold">
                    STELLAR LEDGER SYNCED
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Mobile Handoff Device (Overlap Mockup) */}
          <div className="absolute bottom-[-24px] right-[-10px] md:right-[-20px] w-[200px] bg-white rounded-3xl border-4 border-[#111827] shadow-2xl overflow-hidden hidden sm:block animate-float">
            {/* Phone notch */}
            <div className="bg-[#111827] h-4 w-28 mx-auto rounded-b-xl flex justify-center items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
            </div>
            
            {/* Phone Screen Mock */}
            <div className="p-4 bg-white text-left flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-2">
                <span className="text-[8px] font-bold text-[#6B7280] font-mono">SariPay Mobile</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
              </div>

              {/* QR Handoff Module */}
              <div className="flex flex-col items-center bg-[#FAFAF9] p-3 rounded-xl border border-[#E5E7EB] text-center">
                <p className="text-[9px] font-bold text-[#111827]">Secure QR Handoff</p>
                <div className="w-24 h-24 my-2.5 bg-white border border-[#E5E7EB] p-1.5 rounded-lg flex items-center justify-center relative group">
                  <div className="w-full h-full relative opacity-90">
                    <QrCode className="w-full h-full text-[#111827]" />
                  </div>
                  <div className="absolute left-0 right-0 top-1 h-0.5 bg-[#059669] shadow-sm animate-bounce" />
                </div>
                <span className="text-[8px] text-[#6B7280] font-normal">Show to distributor driver</span>
              </div>

              <div className="bg-[#059669]/5 rounded-lg p-2 border border-[#059669]/10 text-center">
                <p className="text-[9px] font-bold text-[#059669]">Order #98425 Locked</p>
                <p className="text-[8px] text-[#6B7280] mt-0.5 font-normal">₱84,200.00 in Escrow</p>
              </div>
            </div>
          </div>

          {/* Floating metrics stats badges around mockup */}
          <div className="absolute top-[20%] left-[-40px] bg-white px-3.5 py-2 rounded-xl shadow-md border border-[#E5E7EB] flex items-center gap-2.5 hidden xl:flex z-20">
            <div className="w-8 h-8 rounded-lg bg-[#059669]/10 flex items-center justify-center text-[#059669]">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#111827]">500+ Merchants</p>
              <p className="text-[9px] text-[#6B7280] font-normal">Active stores onboarded</p>
            </div>
          </div>

          <div className="absolute bottom-[20%] left-[-60px] bg-white px-3.5 py-2 rounded-xl shadow-md border border-[#E5E7EB] flex items-center gap-2.5 hidden xl:flex z-20">
            <div className="w-8 h-8 rounded-lg bg-[#059669]/10 flex items-center justify-center text-[#059669]">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#111827]">120+ Suppliers</p>
              <p className="text-[9px] text-[#6B7280] font-normal">Distributors connected</p>
            </div>
          </div>

          <div className="absolute top-[-30px] right-[-10px] bg-white px-3.5 py-2 rounded-xl shadow-md border border-[#E5E7EB] flex items-center gap-2.5 hidden xl:flex z-20">
            <div className="w-8 h-8 rounded-lg bg-[#059669]/10 flex items-center justify-center text-[#059669]">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#111827]">₱5.2M Escrowed</p>
              <p className="text-[9px] text-[#6B7280] font-normal">Currently in trust vault</p>
            </div>
          </div>

        </div>
      </section>

      {/* 2. TRUST METRICS SECTION */}
      <section className="w-full bg-[#FAFAF9] border-y border-[#E5E7EB] py-16 relative">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-[#111827]">₱50M+</p>
            <p className="text-xs text-[#6B7280] font-semibold mt-1 uppercase tracking-wider">Processed Escrow</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-[#111827]">1,000+</p>
            <p className="text-xs text-[#6B7280] font-semibold mt-1 uppercase tracking-wider">Merchants</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-[#111827]">250+</p>
            <p className="text-xs text-[#6B7280] font-semibold mt-1 uppercase tracking-wider">Distributors</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-[#111827]">99.9%</p>
            <p className="text-xs text-[#6B7280] font-semibold mt-1 uppercase tracking-wider">Successful Settles</p>
          </div>
          <div className="col-span-2 md:col-span-1">
            <p className="text-3xl sm:text-4xl font-extrabold text-[#059669]">Near-Zero</p>
            <p className="text-xs text-[#6B7280] font-semibold mt-1 uppercase tracking-wider">Transaction Fees</p>
          </div>
        </div>
      </section>

      {/* 2.5 TRUST IN DEPTH SECTION */}
      <section className="w-full bg-white py-20 border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Trust Point 1 */}
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-lg bg-[#059669]/10 flex items-center justify-center text-[#059669] shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                {/* Manrope SemiBold for Card Titles */}
                <h4 className="text-sm font-semibold text-[#111827] mb-1">Secure Escrow Payments</h4>
                {/* Manrope Regular for Supporting Text */}
                <p className="text-xs text-[#6B7280] font-normal leading-relaxed">
                  Funds are secured cryptographically before shipment, ensuring total peace of mind for both retail merchants and distributors.
                </p>
              </div>
            </div>

            {/* Trust Point 2 */}
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-lg bg-[#059669]/10 flex items-center justify-center text-[#059669] shrink-0">
                <Handshake className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#111827] mb-1">Guaranteed Payment Assurance</h4>
                <p className="text-xs text-[#6B7280] font-normal leading-relaxed">
                  Suppliers can verify payment capacity before dispatch, eliminating transaction disputes, bounced checks, or cash flow uncertainty.
                </p>
              </div>
            </div>

            {/* Trust Point 3 */}
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-lg bg-[#059669]/10 flex items-center justify-center text-[#059669] shrink-0">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#111827] mb-1">Delivery Verification</h4>
                <p className="text-xs text-[#6B7280] font-normal leading-relaxed">
                  Instant QR-code scanning acts as cryptographic proof of physical handoff, linking delivery and release automatically.
                </p>
              </div>
            </div>

            {/* Trust Point 4 */}
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-lg bg-[#059669]/10 flex items-center justify-center text-[#059669] shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#111827] mb-1">Reduced Cash Handling Risks</h4>
                <p className="text-xs text-[#6B7280] font-normal leading-relaxed">
                  Protect delivery drivers and shopfront staff by removing the need to manage, store, or carry large physical cash sums.
                </p>
              </div>
            </div>

            {/* Trust Point 5 */}
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-lg bg-[#059669]/10 flex items-center justify-center text-[#059669] shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#111827] mb-1">Faster Settlements</h4>
                <p className="text-xs text-[#6B7280] font-normal leading-relaxed">
                  No manual bank remittances or collection runs. Smart contracts trigger direct wallet payouts within 5 seconds of handoff.
                </p>
              </div>
            </div>

            {/* Trust Point 6 */}
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-lg bg-[#059669]/10 flex items-center justify-center text-[#059669] shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#111827] mb-1">Better Merchant-Supplier Trust</h4>
                <p className="text-xs text-[#6B7280] font-normal leading-relaxed">
                  Align incentives by making transactions objective, automated, and backed by auditable cryptographic ledger records.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section id="how-it-works" className="w-full max-w-7xl mx-auto px-6 py-24 text-center relative">
        <div className="absolute top-[20%] left-[50%] w-[400px] h-[400px] bg-[#059669]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="mb-16">
          <span className="text-[#059669] text-xs font-bold uppercase tracking-widest block mb-3">Simple Handoff Process</span>
          {/* Manrope Bold for Section Titles */}
          <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] tracking-tight font-display">
            How SariPay Works
          </h2>
          {/* Manrope Medium for Body Text */}
          <p className="text-sm sm:text-base text-[#6B7280] font-medium mt-3 max-w-2xl mx-auto">
            A frictionless, multi-party escrow cycle designed to protect both the sari-sari merchant and the distributor.
          </p>
        </div>

        {/* Process Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
          
          {/* Step 1 */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-sm flex flex-col items-center text-center relative group hover:border-[#059669]/30 transition-all duration-300">
            <span className="absolute top-4 right-6 text-2xl font-black text-[#E5E7EB] group-hover:text-[#059669]/20 transition-colors">01</span>
            <div className="w-12 h-12 rounded-xl bg-[#059669]/10 flex items-center justify-center text-[#059669] mb-6">
              <Wallet className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-[#111827] mb-2">Buyer Funds Escrow</h3>
            <p className="text-xs text-[#6B7280] font-normal leading-relaxed">
              Merchant locks payment securely in contract before supplier dispatch.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-sm flex flex-col items-center text-center relative group hover:border-[#059669]/30 transition-all duration-300">
            <span className="absolute top-4 right-6 text-2xl font-black text-[#E5E7EB] group-hover:text-[#059669]/20 transition-colors">02</span>
            <div className="w-12 h-12 rounded-xl bg-[#059669]/10 flex items-center justify-center text-[#059669] mb-6">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-[#111827] mb-2">Supplier Dispatches</h3>
            <p className="text-xs text-[#6B7280] font-normal leading-relaxed">
              Distributor receives proof that escrow funds are secured, then dispatches cargo.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-sm flex flex-col items-center text-center relative group hover:border-[#059669]/30 transition-all duration-300">
            <span className="absolute top-4 right-6 text-2xl font-black text-[#E5E7EB] group-hover:text-[#059669]/20 transition-colors">03</span>
            <div className="w-12 h-12 rounded-xl bg-[#059669]/10 flex items-center justify-center text-[#059669] mb-6">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-[#111827] mb-2">QR Verification</h3>
            <p className="text-xs text-[#6B7280] font-normal leading-relaxed">
              Store owner presents secure QR handoff code during physical delivery handoff.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-sm flex flex-col items-center text-center relative group hover:border-[#059669]/30 transition-all duration-300">
            <span className="absolute top-4 right-6 text-2xl font-black text-[#E5E7EB] group-hover:text-[#059669]/20 transition-colors">04</span>
            <div className="w-12 h-12 rounded-xl bg-[#059669]/10 flex items-center justify-center text-[#059669] mb-6">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-[#111827] mb-2">Automatic Settlement</h3>
            <p className="text-xs text-[#6B7280] font-normal leading-relaxed">
              Smart contract instantly releases locked payments directly to supplier wallet.
            </p>
          </div>

        </div>
      </section>

      {/* 4. CORE FEATURES SECTION */}
      <section id="features" className="w-full bg-white border-y border-[#E5E7EB] py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center mb-16">
            <span className="text-[#059669] text-xs font-bold uppercase tracking-widest block mb-3">Core Platform Capabilities</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] tracking-tight font-display">
              Features Built for Supply Chain Trust
            </h2>
            <p className="text-sm sm:text-base text-[#6B7280] font-medium mt-3 max-w-2xl mx-auto">
              SariPay removes friction on both sides of the retail wholesale supply chain with specialized features.
            </p>
          </div>

          {/* Features Premium 6 Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <div className="bg-[#FAFAF9]/40 border border-[#E5E7EB] p-8 rounded-2xl shadow-sm hover:bg-[#FAFAF9] transition-colors flex flex-col items-start">
              <div className="w-10 h-10 rounded-lg bg-[#059669]/10 flex items-center justify-center text-[#059669] mb-5">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-[#111827] mb-2">Smart Escrow</h4>
              <p className="text-xs text-[#6B7280] font-normal leading-relaxed">
                Funds are secured before inventory leaves the warehouse, removing unpaid delivery risks.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#FAFAF9]/40 border border-[#E5E7EB] p-8 rounded-2xl shadow-sm hover:bg-[#FAFAF9] transition-colors flex flex-col items-start">
              <div className="w-10 h-10 rounded-lg bg-[#059669]/10 flex items-center justify-center text-[#059669] mb-5">
                <QrCode className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-[#111827] mb-2">QR Delivery Verification</h4>
              <p className="text-xs text-[#6B7280] font-normal leading-relaxed">
                Every delivery is verified before payment release, linking physical logistics directly to smart contract payouts.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#FAFAF9]/40 border border-[#E5E7EB] p-8 rounded-2xl shadow-sm hover:bg-[#FAFAF9] transition-colors flex flex-col items-start">
              <div className="w-10 h-10 rounded-lg bg-[#059669]/10 flex items-center justify-center text-[#059669] mb-5">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-[#111827] mb-2">Supplier Assurance</h4>
              <p className="text-xs text-[#6B7280] font-normal leading-relaxed">
                Know payments are available before dispatch. Distributors receive automated signals as soon as the merchant funds the escrow.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-[#FAFAF9]/40 border border-[#E5E7EB] p-8 rounded-2xl shadow-sm hover:bg-[#FAFAF9] transition-colors flex flex-col items-start">
              <div className="w-10 h-10 rounded-lg bg-[#059669]/10 flex items-center justify-center text-[#059669] mb-5">
                <Shield className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-[#111827] mb-2">Merchant Protection</h4>
              <p className="text-xs text-[#6B7280] font-normal leading-relaxed">
                Pay only after successful delivery confirmation. Merchant capital is secured until inventory arrives safely at the storefront.
              </p>
            </div>

            {/* Card 5 */}
            <div className="bg-[#FAFAF9]/40 border border-[#E5E7EB] p-8 rounded-2xl shadow-sm hover:bg-[#FAFAF9] transition-colors flex flex-col items-start">
              <div className="w-10 h-10 rounded-lg bg-[#059669]/10 flex items-center justify-center text-[#059669] mb-5">
                <Fingerprint className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-[#111827] mb-2">Passkey Security</h4>
              <p className="text-xs text-[#6B7280] font-normal leading-relaxed">
                Fast and secure passwordless authentication. Complete orders using Touch ID or Face ID biometric locks.
              </p>
            </div>

            {/* Card 6 */}
            <div className="bg-[#FAFAF9]/40 border border-[#E5E7EB] p-8 rounded-2xl shadow-sm hover:bg-[#FAFAF9] transition-colors flex flex-col items-start">
              <div className="w-10 h-10 rounded-lg bg-[#059669]/10 flex items-center justify-center text-[#059669] mb-5">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-[#111827] mb-2">Instant Settlement</h4>
              <p className="text-xs text-[#6B7280] font-normal leading-relaxed">
                Automatic payment release after successful verification. Escrow settlements clear natively on Stellar under 5 seconds.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 5. DASHBOARD SHOWCASE (INTERACTIVE SECTION) */}
      <section id="solutions" className="w-full max-w-7xl mx-auto px-6 py-24 text-center relative">
        <div className="mb-12">
          <span className="text-[#059669] text-xs font-bold uppercase tracking-widest block mb-3">Live Application Dashboard Showcase</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] tracking-tight font-display">
            A Dual Interface for Seamless Operations
          </h2>
          <p className="text-sm sm:text-base text-[#6B7280] font-medium mt-3 max-w-2xl mx-auto">
            Choose to see how SariPay caters uniquely to both sides of the retail supply chain.
          </p>

          {/* Interactive Toggle Pill Selector */}
          <div className="flex bg-[#E5E7EB]/50 p-1.5 rounded-xl max-w-sm mx-auto mt-8 border border-[#E5E7EB]">
            <button
              onClick={() => setActiveDashboardTab('merchant')}
              className={`flex-1 py-2 px-4 text-xs font-bold rounded-lg transition-all ${
                activeDashboardTab === 'merchant'
                  ? 'bg-white text-[#111827] shadow-sm'
                  : 'text-[#6B7280] hover:text-[#111827]'
              }`}
            >
              Merchant Dashboard
            </button>
            <button
              onClick={() => setActiveDashboardTab('supplier')}
              className={`flex-1 py-2 px-4 text-xs font-bold rounded-lg transition-all ${
                activeDashboardTab === 'supplier'
                  ? 'bg-white text-[#111827] shadow-sm'
                  : 'text-[#6B7280] hover:text-[#111827]'
              }`}
            >
              Supplier Dashboard
            </button>
          </div>
        </div>

        {/* Dynamic Mockup Viewport Container */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-lg overflow-hidden text-left max-w-5xl mx-auto">
          
          {/* Window Frame Header */}
          <div className="bg-[#FAFAF9] border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-400/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-400/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-green-400/80 inline-block" />
              </div>
              <span className="text-xs text-[#6B7280] font-semibold font-mono border-l border-[#E5E7EB] pl-4">
                SariPay Platform v1.4
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#059669]" />
              <span className="text-[10px] font-mono font-bold text-[#059669] uppercase tracking-wider">Secure Session Active</span>
            </div>
          </div>

          {/* Main Dashboard Window Content */}
          <div className="p-6 md:p-8 bg-[#FAFAF9]/30 grid grid-cols-12 gap-8">
            
            {/* 5.1 MERCHANT DASHBOARD VIEW */}
            {activeDashboardTab === 'merchant' && (
              <>
                {/* Stats Panel */}
                <div className="col-span-12 md:col-span-4 flex flex-col gap-6">
                  <div>
                    <h3 className="text-xl font-bold text-[#111827] mb-1">Nena's Sari-Sari Store</h3>
                    <p className="text-xs text-[#6B7280] font-normal">Account Level: Verified Partner</p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">Available Balance</span>
                    <span className="text-2xl font-extrabold text-[#111827]">₱142,500.00</span>
                    <p className="text-[10px] text-[#6B7280] mt-2 font-normal">Connected Wallet: Stellar Soroban Account</p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">Funds in Active Escrow</span>
                    <span className="text-2xl font-extrabold text-[#059669]">₱54,000.00</span>
                    <span className="text-[9px] text-[#6B7280] mt-2 font-normal">3 orders pending delivery verification</span>
                  </div>
                </div>

                {/* QR Generation Handoff & Lists */}
                <div className="col-span-12 md:col-span-8 flex flex-col gap-6">
                  {/* Order Details Banner */}
                  <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm grid grid-cols-12 gap-6 items-center">
                    <div className="col-span-12 sm:col-span-8">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[9px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full uppercase border border-amber-200">
                          Awaiting QR Check
                        </span>
                        <span className="text-xs text-[#6B7280] font-normal">Order #87192</span>
                      </div>
                      <h4 className="text-sm font-bold text-[#111827]">San Miguel Wholesalers Inc.</h4>
                      <p className="text-xs text-[#6B7280] font-normal mt-1 leading-relaxed">
                        Funds locked securely in contract address. Present the QR code to the driver upon unloading the crates.
                      </p>
                      <div className="mt-4 flex items-center gap-2 text-xs">
                        <span className="text-stone-400 font-normal">Total Locked:</span>
                        <span className="font-bold text-[#111827]">₱24,000.00</span>
                      </div>
                    </div>
                    {/* Embedded QR Generator Interface */}
                    <div className="col-span-12 sm:col-span-4 flex flex-col items-center bg-[#FAFAF9] p-4 rounded-xl border border-[#E5E7EB]">
                      <div className="w-24 h-24 bg-white border border-[#E5E7EB] p-2 rounded-lg flex items-center justify-center">
                        <QrCode className="w-full h-full text-[#111827]" />
                      </div>
                      <span className="text-[9px] text-[#059669] font-bold mt-2 font-mono">GENERATE ESCROW QR</span>
                    </div>
                  </div>

                  {/* List of Escrowed Orders */}
                  <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm">
                    <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-4 font-sans">Pending Deliveries Queue</h4>
                    
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-center p-3 rounded-xl bg-[#FAFAF9]/60 border border-[#E5E7EB]/80 text-xs">
                        <div>
                          <p className="font-bold text-[#111827]">Order #86992 — Coca-Cola Bottlers</p>
                          <p className="text-[9px] text-[#6B7280] font-normal">Stellar ledger tx: s439k...12df</p>
                        </div>
                        <span className="inline-flex items-center gap-1 text-[9px] text-[#059669] bg-[#059669]/10 border border-[#059669]/20 px-2.5 py-0.5 rounded-full font-bold">
                          ₱30,000.00 Escrowed
                        </span>
                      </div>

                      <div className="flex justify-between items-center p-3 rounded-xl bg-[#FAFAF9]/60 border border-[#E5E7EB]/80 text-xs">
                        <div>
                          <p className="font-bold text-[#111827]">Order #85220 — Puregold Distributor</p>
                          <p className="text-[9px] text-[#6B7280] font-normal">Stellar ledger tx: e391a...83d2</p>
                        </div>
                        <span className="inline-flex items-center gap-1 text-[9px] text-amber-600 bg-amber-50 border border-amber-200/50 px-2.5 py-0.5 rounded-full font-semibold">
                          Dispatched
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* 5.2 SUPPLIER DASHBOARD VIEW */}
            {activeDashboardTab === 'supplier' && (
              <>
                {/* Stats Panel */}
                <div className="col-span-12 md:col-span-4 flex flex-col gap-6">
                  <div>
                    <h3 className="text-xl font-bold text-[#111827] mb-1">San Miguel Wholesalers</h3>
                    <p className="text-xs text-[#6B7280] font-normal">Distributor ID: Supplier #09425</p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">Guaranteed Revenue</span>
                    <span className="text-2xl font-extrabold text-[#059669]">₱485,000.00</span>
                    <p className="text-[10px] text-[#6B7280] mt-2 font-normal font-sans">Locked securely by merchants before shipment</p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">Completed Settlements</span>
                    <span className="text-2xl font-extrabold text-[#111827]">₱1,840,500.00</span>
                    <span className="text-[9px] text-[#6B7280] mt-2 font-normal font-sans">Instantly credited via Stellar contracts</span>
                  </div>
                </div>

                {/* Driver Scan Scanner Handoff */}
                <div className="col-span-12 md:col-span-8 flex flex-col gap-6">
                  
                  {/* Delivery Route Active State */}
                  <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm grid grid-cols-12 gap-6 items-center">
                    <div className="col-span-12 sm:col-span-8">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[9px] bg-emerald-500/10 text-[#059669] font-bold px-2 py-0.5 rounded-full uppercase border border-[#059669]/20">
                          Route Active
                        </span>
                        <span className="text-xs text-[#6B7280] font-normal">Truck ID: Route #12-Manila</span>
                      </div>
                      <h4 className="text-sm font-bold text-[#111827]">Nena's Sari-Sari Store Delivery</h4>
                      <p className="text-xs text-[#6B7280] font-normal mt-1 leading-relaxed">
                        Status: Vehicle is close. Scan the merchant's escrow QR code on their phone screen to unlock the payment contract instantly.
                      </p>
                      
                      <div className="mt-4 flex items-center gap-4 text-xs font-semibold text-[#111827]">
                        <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#059669]" /> Sampaloc, Manila</span>
                        <span className="text-[#6B7280] font-normal">|</span>
                        <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-[#059669]" /> ₱24,000.00 Escrowed</span>
                      </div>
                    </div>

                    {/* QR scanner camera mockup */}
                    <div className="col-span-12 sm:col-span-4 flex flex-col items-center bg-[#FAFAF9] p-4 rounded-xl border border-[#E5E7EB]">
                      <div className="w-24 h-24 bg-white border border-[#E5E7EB] rounded-lg flex flex-col items-center justify-center relative overflow-hidden">
                        <ScanLine className="w-12 h-12 text-[#059669] animate-pulse" />
                        <div className="absolute inset-0 border-2 border-emerald-500/30 rounded-lg animate-pulse" />
                      </div>
                      <span className="text-[9px] text-[#059669] font-bold mt-2 font-mono">SCAN QR CODE</span>
                    </div>
                  </div>

                  {/* Active Shipments Queue */}
                  <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-sm">
                    <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-4">Escrow-Backed Shipments Queue</h4>
                    
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-center p-3 rounded-xl bg-[#FAFAF9]/60 border border-[#E5E7EB]/80 text-xs">
                        <div>
                          <p className="font-bold text-[#111827]">Tondo Corner Store (Order #86901)</p>
                          <p className="text-[9px] text-[#6B7280] font-normal">Stellar ledger: locked in escrow contract</p>
                        </div>
                        <span className="inline-flex items-center gap-1 text-[9px] text-[#059669] bg-[#059669]/10 border border-[#059669]/20 px-2.5 py-0.5 rounded-full font-bold">
                          ₱18,200.00 Secured
                        </span>
                      </div>

                      <div className="flex justify-between items-center p-3 rounded-xl bg-[#FAFAF9]/60 border border-[#E5E7EB]/80 text-xs">
                        <div>
                          <p className="font-bold text-[#111827]">Divisoria Retailers (Order #86520)</p>
                          <p className="text-[9px] text-[#6B7280] font-normal">Stellar ledger: locked in escrow contract</p>
                        </div>
                        <span className="inline-flex items-center gap-1 text-[9px] text-[#059669] bg-[#059669]/10 border border-[#059669]/20 px-2.5 py-0.5 rounded-full font-bold">
                          ₱54,000.00 Secured
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              </>
            )}

          </div>

        </div>
      </section>

      {/* 6. WHY BUSINESSES CHOOSE SARIPAY */}
      <section className="w-full bg-white border-y border-[#E5E7EB] py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center mb-16">
            <span className="text-[#059669] text-xs font-bold uppercase tracking-widest block mb-3">Enterprise Alignment</span>
            {/* Manrope Bold for Section Titles */}
            <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] tracking-tight font-display">
              Built for Trusted Business Transactions.
            </h2>
            {/* Manrope Medium for Body Text */}
            <p className="text-sm sm:text-base text-[#6B7280] font-medium mt-3 max-w-2xl mx-auto">
              SariPay removes payment uncertainty from distribution networks by combining escrow protection, delivery verification, and automated settlement into one secure platform.
            </p>
          </div>

          {/* 4 Premium Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Card 1 */}
            <div className="bg-[#FAFAF9]/40 border border-[#E5E7EB] p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex gap-6 items-start">
              <div className="w-12 h-12 rounded-xl bg-[#059669]/10 flex items-center justify-center text-[#059669] shrink-0">
                <LockKeyhole className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-[#111827] mb-2 font-sans">No Cash Handling</h4>
                <p className="text-sm text-[#6B7280] font-normal leading-relaxed">
                  Reduce robbery and theft risks. Drive cashless payments to eliminate the danger of delivery drivers carrying large physical cash sums.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#FAFAF9]/40 border border-[#E5E7EB] p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex gap-6 items-start">
              <div className="w-12 h-12 rounded-xl bg-[#059669]/10 flex items-center justify-center text-[#059669] shrink-0">
                <UserCheck2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-[#111827] mb-2 font-sans">Guaranteed Payments</h4>
                <p className="text-sm text-[#6B7280] font-normal leading-relaxed">
                  Suppliers verify payment capacity before shipping. Ensure every single dispatch matches an already funded escrow.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#FAFAF9]/40 border border-[#E5E7EB] p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex gap-6 items-start">
              <div className="w-12 h-12 rounded-xl bg-[#059669]/10 flex items-center justify-center text-[#059669] shrink-0">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-[#111827] mb-2 font-sans">Lower Costs</h4>
                <p className="text-sm text-[#6B7280] font-normal leading-relaxed">
                  Near-zero blockchain transaction fees. Avoid heavy merchant card fees and manual deposit validation fees.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-[#FAFAF9]/40 border border-[#E5E7EB] p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex gap-6 items-start">
              <div className="w-12 h-12 rounded-xl bg-[#059669]/10 flex items-center justify-center text-[#059669] shrink-0">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-[#111827] mb-2 font-sans">Faster Operations</h4>
                <p className="text-sm text-[#6B7280] font-normal leading-relaxed">
                  No manual remittance processing. When delivery completes, funds settle instantly, reducing accounting backlogs from weeks to seconds.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 7. SECURITY SECTION */}
      <section id="security" className="w-full bg-[#FAFAF9] py-24 relative overflow-hidden">
        <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-[#059669]/5 rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Security Left Content */}
          <div className="lg:col-span-6 flex flex-col items-start text-left z-10">
            <span className="text-[#059669] text-xs font-bold uppercase tracking-widest block mb-3">Invisible Web3 Tech</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] tracking-tight mb-6 font-display">
              Enterprise Grade Shielding
            </h2>
            <p className="text-sm sm:text-base text-[#6B7280] font-medium leading-relaxed mb-10">
              The complexity of smart contracts is completely handled behind the scenes. Your team experiences simple logins, face verification, and instant QR checks, while the blockchain ensures absolute immutability.
            </p>

            {/* Bullet grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              <div className="flex gap-3.5 items-start">
                <div className="w-8 h-8 rounded-lg bg-[#059669]/10 flex items-center justify-center text-[#059669] shrink-0 mt-0.5">
                  <Fingerprint className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#111827]">Passkey Authentication</h4>
                  <p className="text-xs text-[#6B7280] font-normal mt-1 leading-relaxed">Secure logins without passwords.</p>
                </div>
              </div>

              <div className="flex gap-3.5 items-start">
                <div className="w-8 h-8 rounded-lg bg-[#059669]/10 flex items-center justify-center text-[#059669] shrink-0 mt-0.5">
                  <Smartphone className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#111827]">Face ID Support</h4>
                  <p className="text-xs text-[#6B7280] font-normal mt-1 leading-relaxed">Verify high-value orders instantly.</p>
                </div>
              </div>

              <div className="flex gap-3.5 items-start">
                <div className="w-8 h-8 rounded-lg bg-[#059669]/10 flex items-center justify-center text-[#059669] shrink-0 mt-0.5">
                  <Fingerprint className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#111827]">Fingerprint Login</h4>
                  <p className="text-xs text-[#6B7280] font-normal mt-1 leading-relaxed">Fast biometrics authentication.</p>
                </div>
              </div>

              <div className="flex gap-3.5 items-start">
                <div className="w-8 h-8 rounded-lg bg-[#059669]/10 flex items-center justify-center text-[#059669] shrink-0 mt-0.5">
                  <Lock className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#111827]">Blockchain Escrow</h4>
                  <p className="text-xs text-[#6B7280] font-normal mt-1 leading-relaxed">Funds locked in trust-less smart code.</p>
                </div>
              </div>

              <div className="flex gap-3.5 items-start">
                <div className="w-8 h-8 rounded-lg bg-[#059669]/10 flex items-center justify-center text-[#059669] shrink-0 mt-0.5">
                  <FileText className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#111827]">Immutable Records</h4>
                  <p className="text-xs text-[#6B7280] font-normal mt-1 leading-relaxed">Tamper-proof ledger transaction logs.</p>
                </div>
              </div>

              <div className="flex gap-3.5 items-start">
                <div className="w-8 h-8 rounded-lg bg-[#059669]/10 flex items-center justify-center text-[#059669] shrink-0 mt-0.5">
                  <Cpu className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#111827]">Contract Automation</h4>
                  <p className="text-xs text-[#6B7280] font-normal mt-1 leading-relaxed">Zero humans needed for settlements.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Security Right Graphic */}
          <div className="lg:col-span-6 flex justify-center items-center relative z-10">
            <div className="w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] bg-white rounded-3xl border border-[#E5E7EB] shadow-2xl p-8 flex flex-col justify-center items-center relative">
              <div className="absolute inset-0 bg-[#059669]/5 rounded-3xl blur-xl animate-pulse-subtle pointer-events-none" />
              
              <div className="w-24 h-24 rounded-2xl bg-[#059669]/10 flex items-center justify-center text-[#059669] mb-8 relative">
                <Shield className="w-12 h-12" />
                <div className="absolute inset-[-4px] border border-[#059669]/20 rounded-2xl animate-ping" style={{ animationDuration: '3s' }} />
              </div>

              <h3 className="text-lg font-semibold text-[#111827] text-center mb-2 font-sans">Cryptographic Shield Active</h3>
              <p className="text-xs text-[#6B7280] text-center max-w-xs leading-relaxed font-normal">
                All SariPay transactions are natively written to the Stellar ledger via secure rust smart code signatures.
              </p>

              <div className="mt-8 border-t border-[#E5E7EB] pt-6 w-full flex items-center justify-between text-[10px] font-mono text-[#6B7280]">
                <span>Ledger Event Status</span>
                <span className="text-[#059669] bg-[#059669]/10 px-2 py-0.5 rounded border border-[#059669]/20 font-bold">SECURED</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 8. TESTIMONIALS SECTION */}
      <section className="w-full bg-white border-y border-[#E5E7EB] py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center mb-16">
            <span className="text-[#059669] text-xs font-bold uppercase tracking-widest block mb-3">Merchant & Supplier Feedback</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] tracking-tight font-display">
              Loved by Stores and Suppliers Aligned
            </h2>
            <p className="text-sm sm:text-base text-[#6B7280] font-medium mt-3 max-w-2xl mx-auto">
              See how modernizing payments creates seamless operations across wholesale networks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <div className="bg-[#FAFAF9]/40 border border-[#E5E7EB] p-8 rounded-2xl flex flex-col justify-between hover:shadow-sm transition-all duration-300">
              <div>
                <div className="flex gap-1 text-[#F59E0B] mb-5">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <p className="text-sm text-[#111827] italic leading-relaxed mb-6 font-normal">
                  "Remittance check delays used to lock our logistics operations for weeks. With SariPay's Stellar contract releases, settlements happen within seconds of delivery verification. Incredible visibility!"
                </p>
              </div>
              <div className="flex items-center gap-3.5 pt-4 border-t border-[#E5E7EB]">
                <div className="w-10 h-10 rounded-full bg-[#059669]/10 flex items-center justify-center font-bold text-xs text-[#059669]">
                  RM
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#111827]">Ramon Mercado</h4>
                  <p className="text-[10px] text-[#6B7280] font-normal">Operations Lead, Universal Foods Corp.</p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#FAFAF9]/40 border border-[#E5E7EB] p-8 rounded-2xl flex flex-col justify-between hover:shadow-sm transition-all duration-300">
              <div>
                <div className="flex gap-1 text-[#F59E0B] mb-5">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <p className="text-sm text-[#111827] italic leading-relaxed mb-6 font-normal">
                  "No more holding bulky amounts of cash at my store waiting for dispatch trucks. I just fund my SariPay escrow on my phone. The driver scans my QR and payment is released. Safe and simple!"
                </p>
              </div>
              <div className="flex items-center gap-3.5 pt-4 border-t border-[#E5E7EB]">
                <div className="w-10 h-10 rounded-full bg-[#059669]/10 flex items-center justify-center font-bold text-xs text-[#059669]">
                  NC
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#111827]">Nena Cruz</h4>
                  <p className="text-[10px] text-[#6B7280] font-normal">Store Owner, Nena's Sari-Sari Store</p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#FAFAF9]/40 border border-[#E5E7EB] p-8 rounded-2xl flex flex-col justify-between hover:shadow-sm transition-all duration-300">
              <div>
                <div className="flex gap-1 text-[#F59E0B] mb-5">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <p className="text-sm text-[#111827] italic leading-relaxed mb-6 font-normal">
                  "We eliminated delivery disputes entirely. The cryptographic handoff through the QR code acts as immutable proof of delivery. Highly recommended for distributors handling high daily volume."
                </p>
              </div>
              <div className="flex items-center gap-3.5 pt-4 border-t border-[#E5E7EB]">
                <div className="w-10 h-10 rounded-full bg-[#059669]/10 flex items-center justify-center font-bold text-xs text-[#059669]">
                  JD
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#111827]">Jaime Dy</h4>
                  <p className="text-[10px] text-[#6B7280] font-normal">General Manager, Manila Beverage Logistics</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 9. PRICING TEASER SECTION */}
      <section id="pricing" className="w-full bg-[#FAFAF9] py-24 relative">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-[#059669] text-xs font-bold uppercase tracking-widest block mb-3">Transparent Fees</span>
          <h2 className="text-3xl font-bold text-[#111827] tracking-tight font-display mb-4">
            Near-Zero Pricing Scheme
          </h2>
          <p className="text-sm sm:text-base text-[#6B7280] font-medium mb-12 max-w-xl mx-auto">
            We built SariPay natively on Stellar blockchain to keep transactions affordable and fast.
          </p>

          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-8 max-w-lg mx-auto text-left flex flex-col gap-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#059669]" />
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-base font-semibold text-[#111827]">Standard Escrow</h4>
                <p className="text-xs text-[#6B7280] mt-0.5 font-normal">For merchants & distributors</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-[#111827]">0.1%</span>
                <span className="text-[10px] text-[#6B7280] block font-normal">per settled contract</span>
              </div>
            </div>

            <ul className="flex flex-col gap-3.5 text-xs text-[#6B7280] border-y border-[#E5E7EB] py-6 font-normal">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4.5 h-4.5 text-[#059669]" /> 5-second ledger payment releases</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4.5 h-4.5 text-[#059669]" /> Unlimited secure QR code generation</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4.5 h-4.5 text-[#059669]" /> Enterprise-grade passkey biometrics</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4.5 h-4.5 text-[#059669]" /> Localized payment channel gateways</li>
            </ul>

            <Button
              onClick={handleGetStarted}
              className="w-full py-3 bg-[#059669] hover:bg-[#10B981] text-white text-sm font-semibold rounded-xl"
            >
              Get Started for Free
            </Button>
          </div>
        </div>
      </section>

      {/* 10. FINAL CALL TO ACTION (BANNER) */}
      <section className="w-full max-w-7xl mx-auto px-6 pb-24">
        <div className="bg-[#111827] text-white rounded-3xl p-10 md:p-16 relative overflow-hidden flex flex-col items-center text-center shadow-xl">
          <div className="absolute top-[-50%] left-[-20%] w-[500px] h-[500px] bg-[#059669]/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-50%] right-[-20%] w-[500px] h-[500px] bg-[#10B981]/10 rounded-full blur-[120px] pointer-events-none" />

          <span className="text-[#059669] text-xs font-bold uppercase tracking-widest block mb-4 relative z-10 font-mono">
            Get Onboarded Today
          </span>

          {/* Manrope ExtraBold for Hero/CTA Headlines */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight max-w-3xl mb-6 relative z-10 leading-[1.2] font-display">
            Secure Payments. Verified Deliveries.
          </h2>

          {/* Manrope Regular for Supporting Text */}
          <p className="text-sm sm:text-base text-gray-400 font-normal max-w-xl mb-10 relative z-10 leading-relaxed">
            Transform your supply chain with trusted escrow payments and delivery verification designed for modern distributors and merchants.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 relative z-10 w-full sm:w-auto">
            {/* Manrope SemiBold for buttons */}
            <Button
              onClick={handleGetStarted}
              className="px-8 py-3.5 bg-[#059669] hover:bg-[#10B981] text-white text-sm font-semibold shadow-md shadow-[#059669]/20 rounded-xl"
            >
              Get Started
            </Button>
            <Button
              variant="secondary"
              onClick={handleRequestDemo}
              className="px-8 py-3.5 bg-transparent hover:bg-white/5 text-white border border-gray-700 text-sm font-semibold rounded-xl"
            >
              Request Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Interactive Video Demo Modal Overlay */}
      {isPlayingDemo && (
        <div className="fixed inset-0 z-50 bg-[#111827]/85 flex items-center justify-center p-6 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-2xl max-w-3xl w-full p-6 relative">
            <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-4 mb-4">
              <h3 className="font-bold text-[#111827] text-sm">SariPay Platform Verification Demo</h3>
              <button 
                onClick={() => setIsPlayingDemo(false)}
                className="text-stone-400 hover:text-[#111827] text-xs font-bold border border-[#E5E7EB] px-2.5 py-1 rounded-lg hover:bg-stone-50 transition-colors"
              >
                Close
              </button>
            </div>
            <div className="aspect-video bg-stone-900 rounded-xl flex flex-col items-center justify-center text-center p-6 relative overflow-hidden border border-[#E5E7EB]/10">
              <div className="absolute inset-0 bg-gradient-to-tr from-stone-950 via-stone-900 to-stone-950 opacity-90" />
              <div className="w-16 h-16 rounded-full bg-[#059669] flex items-center justify-center text-white relative z-10 shadow-lg cursor-pointer hover:scale-105 transition-transform animate-pulse">
                <Play className="w-6 h-6 fill-current ml-1" />
              </div>
              <p className="text-xs text-stone-400 max-w-md mt-6 relative z-10 font-normal">
                SariPay Platform Walkthrough: See how a store registers, locks funds in escrow, dispatches cargo via routes, and releases funds with a single QR scan.
              </p>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}