'use client';

import React, { useState } from 'react';
import { 
  Wallet, 
  X, 
  CreditCard, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck,
  Building,
  Smartphone
} from 'lucide-react';
import { Button } from '@/components/common/Button';
import confetti from 'canvas-confetti';

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (amountXlm: number, amountPhp: number) => void;
  currentBalanceXlm?: string;
}

export default function TopUpModal({
  isOpen,
  onClose,
  onSuccess,
  currentBalanceXlm = "0.00"
}: TopUpModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<'GCash' | 'Maya' | 'Bank'>('GCash');
  const [selectedAmountPhp, setSelectedAmountPhp] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('0917 123 4567');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  if (!isOpen) return null;

  const XLM_PHP_RATE = 56.50; // 1 XLM = ~56.50 PHP

  const effectivePhp = customAmount ? parseFloat(customAmount) || 0 : selectedAmountPhp;
  const calculatedXlm = (effectivePhp / XLM_PHP_RATE).toFixed(2);

  const presetAmounts = [500, 1000, 2500, 5000, 10000];

  const handleDeposit = () => {
    if (effectivePhp <= 0) return;
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsDone(true);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });

      onSuccess(parseFloat(calculatedXlm), effectivePhp);

      setTimeout(() => {
        setIsDone(false);
        onClose();
      }, 1800);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-scale-up">
        
        {/* Header */}
        <div className="px-6 py-4.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Top Up Merchant Balance</h3>
              <p className="text-xs text-slate-500">Deposit fiat PHP into your on-chain settlement account</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isDone ? (
          <div className="p-10 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Top-Up Successful!</h3>
            <p className="text-xs text-slate-600">
              Credited <strong className="text-emerald-600">₱{effectivePhp.toLocaleString()} ({calculatedXlm} XLM)</strong> via {selectedMethod} into your Stellar Testnet wallet.
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            
            {/* Payment Method Selector */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">Select Payment Method</label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'GCash', label: 'GCash', icon: Smartphone, color: 'text-blue-600' },
                  { id: 'Maya', label: 'Maya', icon: Smartphone, color: 'text-emerald-600' },
                  { id: 'Bank', label: 'BDO / BPI', icon: Building, color: 'text-amber-600' }
                ].map(method => {
                  const Icon = method.icon;
                  const isSelected = selectedMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setSelectedMethod(method.id as any)}
                      className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all text-center cursor-pointer ${
                        isSelected 
                          ? 'border-emerald-500 bg-emerald-50/40 shadow-xs' 
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${method.color}`} />
                      <span className="text-xs font-extrabold text-slate-900">{method.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Presets */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">Select Amount (PHP)</label>
              <div className="grid grid-cols-3 gap-2">
                {presetAmounts.map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setSelectedAmountPhp(amt);
                      setCustomAmount('');
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${
                      !customAmount && selectedAmountPhp === amt 
                        ? 'border-emerald-500 bg-emerald-600 text-white shadow-xs' 
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    ₱{amt.toLocaleString()}
                  </button>
                ))}
                <input
                  type="number"
                  placeholder="Custom ₱"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="px-3 py-2 text-xs font-extrabold border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 text-center"
                />
              </div>
            </div>

            {/* Conversion Summary Pill */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">You will receive</span>
                <span className="text-base font-extrabold text-emerald-600 font-mono">+{calculatedXlm} XLM</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Fee</span>
                <span className="text-xs font-extrabold text-emerald-600">₱0.00 (Sponsored)</span>
              </div>
            </div>

            {/* Action */}
            <Button
              variant="primary"
              disabled={effectivePhp <= 0 || isProcessing}
              onClick={handleDeposit}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3.5 rounded-2xl shadow-md shadow-emerald-900/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                'Processing via ' + selectedMethod + '...'
              ) : (
                <>
                  Deposit ₱{effectivePhp.toLocaleString()} <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>

          </div>
        )}

      </div>
    </div>
  );
}
