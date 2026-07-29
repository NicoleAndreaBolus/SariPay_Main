'use client';

import React, { useState } from 'react';
import { Calculator, ArrowRightLeft, ShieldCheck } from 'lucide-react';

export function CurrencyConverter() {
  const [phpAmount, setPhpAmount] = useState<string>('1000');
  const [rate, setRate] = useState<number>(11.0); // 1 XLM = ~11 PHP (Sample conversion rate)

  const numPhp = parseFloat(phpAmount) || 0;
  const numXlm = (numPhp / rate).toFixed(2);
  const escrowFeeXlm = (parseFloat(numXlm) * 0.0025).toFixed(4); // 0.25% fee

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-sm">Quick Currency & Escrow Calculator</h3>
            <p className="text-xs text-slate-500">Estimate inventory cost & 0.25% escrow lockup fee</p>
          </div>
        </div>
        <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">
          1 XLM ≈ ₱{rate.toFixed(2)} PHP
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Enter Amount (PHP ₱)</label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-semibold">₱</span>
            <input
              type="number"
              value={phpAmount}
              onChange={(e) => setPhpAmount(e.target.value)}
              placeholder="e.g. 1000"
              className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-medium"
            />
          </div>
        </div>

        <div className="flex items-center justify-center pt-4 md:pt-0">
          <ArrowRightLeft className="w-5 h-5 text-slate-400" />
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
          <div className="flex justify-between items-center text-xs text-slate-500 mb-1">
            <span>Estimated Escrow Value</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-lg font-bold text-slate-900">{numXlm} <span className="text-xs font-normal text-slate-500">XLM</span></div>
          <div className="text-[11px] text-emerald-600 font-medium">Escrow Fee: ~{escrowFeeXlm} XLM (0.25%)</div>
        </div>
      </div>
    </div>
  );
}
