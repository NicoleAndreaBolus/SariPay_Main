'use client';

import React from 'react';
import { CheckCircle2, QrCode, ShieldCheck, Download, Share2, X, ExternalLink } from 'lucide-react';
import { Button } from '@/components/common/Button';

interface DeliveryReceiptProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  merchantName: string;
  supplierName: string;
  amountXlm: string;
  amountPhp: string;
  txHash: string;
  date: string;
}

export function DeliveryReceiptModal({
  isOpen,
  onClose,
  orderId,
  merchantName,
  supplierName,
  amountXlm,
  amountPhp,
  txHash,
  date,
}: DeliveryReceiptProps) {
  if (!isOpen) return null;

  const handlePrintOrSave = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header Ribbon */}
        <div className="bg-emerald-600 p-6 text-white text-center relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full bg-emerald-700/50 hover:bg-emerald-700 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-md">
            <CheckCircle2 className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">Delivery Handoff Verified!</h2>
          <p className="text-xs text-emerald-100 mt-1">Cryptographic Proof-of-Delivery on Stellar</p>
        </div>

        {/* Receipt Body */}
        <div className="p-6 space-y-4 text-slate-800">
          <div className="text-center pb-3 border-b border-dashed border-slate-200">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Settled Amount</span>
            <div className="text-3xl font-black text-slate-900 mt-1">₱{amountPhp}</div>
            <span className="text-xs font-semibold text-emerald-600">{amountXlm} XLM (Released Instantly)</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Order Reference:</span>
              <span className="font-mono font-bold text-slate-900">#{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Retail Merchant:</span>
              <span className="font-semibold text-slate-900">{merchantName || 'Nicole Store'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Wholesale Supplier:</span>
              <span className="font-semibold text-slate-900">{supplierName || 'Santos Distribution'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Timestamp:</span>
              <span className="text-slate-700">{date || new Date().toLocaleString()}</span>
            </div>
          </div>

          {/* On-Chain Cryptographic Proof Box */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Stellar Soroban Proof</span>
            </div>
            <div className="font-mono text-[10px] text-slate-500 truncate select-all">
              Tx: {txHash || '7aa2dfdd8757f8f8167355641c39f9fa1d877bf4ef6c4ba8b88de2bbc40349d4'}
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-6 pt-0 flex gap-3">
          <Button 
            onClick={handlePrintOrSave}
            variant="secondary" 
            className="flex-1 flex items-center justify-center gap-2 text-xs py-2.5 rounded-xl border-slate-200"
          >
            <Download className="w-4 h-4" />
            Save Receipt
          </Button>
          <Button 
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 text-xs py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
