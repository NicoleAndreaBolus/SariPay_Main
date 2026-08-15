'use client';

import React, { useState } from 'react';
import { 
  Award, 
  Zap, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight, 
  Wallet,
  PlusCircle,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/common/Button';
import confetti from 'canvas-confetti';

interface SariScoreWidgetProps {
  completedDeliveriesCount: number;
  onOpenTopUp: () => void;
  onDrawAdvance: (amountPhp: number) => void;
}

export default function SariScoreWidget({
  completedDeliveriesCount = 5,
  onOpenTopUp,
  onDrawAdvance
}: SariScoreWidgetProps) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [creditDrawn, setCreditDrawn] = useState(false);

  // Dynamic Credit Score Calculation (Base 650 + 15 per completed delivery up to 850)
  const calculatedScore = Math.min(850, 650 + completedDeliveriesCount * 18);

  // Available Credit Line (Base 5,000 + 2,000 per delivery up to 25,000)
  const availableCreditPhp = Math.min(25000, 5000 + completedDeliveriesCount * 2000);

  const getTier = (score: number) => {
    if (score >= 780) return { label: 'Gold Merchant', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    if (score >= 700) return { label: 'Silver Merchant', color: 'text-slate-700 bg-slate-100 border-slate-200' };
    return { label: 'Bronze Partner', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
  };

  const tier = getTier(calculatedScore);

  const handleDraw = () => {
    setIsDrawing(true);
    setTimeout(() => {
      setIsDrawing(false);
      setCreditDrawn(true);
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 }
      });
      onDrawAdvance(availableCreditPhp);
    }, 1000);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-700/60 relative overflow-hidden flex flex-col justify-between gap-6">
      
      {/* Background Decorative Mesh */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-10 w-60 h-60 bg-emerald-600/10 rounded-full blur-2xl pointer-events-none"></div>

      {/* Top Row: SariScore & Gasless Banner */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Left: Score & Tier */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shadow-inner">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">SariScore™ On-Chain Credit</span>
              <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${tier.color}`}>
                {tier.label}
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">{calculatedScore}</span>
              <span className="text-xs text-slate-400 font-semibold">/ 850 pts</span>
              <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-0.5 ml-2">
                <TrendingUp className="w-3.5 h-3.5" /> Top 5%
              </span>
            </div>
          </div>
        </div>

        {/* Right: Gasless Sponsored Badge & Top Up Action */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-extrabold">
            <Zap className="w-3.5 h-3.5 animate-pulse" />
            <span>Gasless Relayer Active</span>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={onOpenTopUp}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold px-3.5 py-1.5 rounded-xl shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" /> Top Up (PHP)
          </Button>
        </div>

      </div>

      {/* Middle: Credit Line & Working Capital Progress */}
      <div className="relative z-10 bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Available Restocking Credit Line</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl sm:text-2xl font-black text-white">₱{availableCreditPhp.toLocaleString()}.00</span>
            <span className="text-xs text-emerald-400 font-bold">0% Interest • 7 Days Term</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 max-w-md">
            Unlocked based on your <strong className="text-white">{completedDeliveriesCount} verified on-chain escrow deliveries</strong>. No collateral required.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          disabled={isDrawing || creditDrawn}
          onClick={handleDraw}
          className="bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-extrabold px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer disabled:opacity-50 whitespace-nowrap"
        >
          {creditDrawn ? (
            '✓ Advance Credited'
          ) : isDrawing ? (
            'Drawing Advance...'
          ) : (
            <>
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Draw Restock Advance
            </>
          )}
        </Button>

      </div>

    </div>
  );
}
