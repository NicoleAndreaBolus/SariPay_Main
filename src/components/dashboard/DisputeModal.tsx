'use client';

import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  X, 
  CheckCircle2, 
  FileText, 
  Camera, 
  DollarSign,
  Lock,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/common/Button';

interface DisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  amountPhp: string;
  amountXlm: string;
  merchantName: string;
  supplierName: string;
  onConfirmDispute: (reason: string, details: string) => void;
}

export function DisputeModal({
  isOpen,
  onClose,
  orderId,
  amountPhp,
  amountXlm,
  merchantName,
  supplierName,
  onConfirmDispute,
}: DisputeModalProps) {
  const [reason, setReason] = useState<string>('Damaged / Broken Inventory');
  const [details, setDetails] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        onConfirmDispute(reason, details);
        setIsSuccess(false);
        onClose();
      }, 1500);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Ribbon */}
        <div className="bg-red-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-700/50 flex items-center justify-center text-white">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm tracking-tight">Initiate Escrow Dispute</h3>
              <p className="text-[11px] text-red-100">Lock escrow funds & claim merchant refund</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full bg-red-700/50 hover:bg-red-700 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 text-slate-800">
          {isSuccess ? (
            <div className="py-8 text-center animate-in zoom-in-95">
              <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto mb-3" />
              <h4 className="text-base font-extrabold text-slate-900">Dispute Filed On-Chain</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Escrow payout locked. ₱{amountPhp} ({amountXlm} XLM) will be refunded to merchant wallet upon mediator verification.
              </p>
            </div>
          ) : (
            <>
              {/* Order Info Pill */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs flex justify-between items-center">
                <div>
                  <span className="text-slate-500">Disputed Order: </span>
                  <span className="font-mono font-bold text-slate-900">#{orderId}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900">₱{amountPhp}</span>
                  <span className="text-[10px] text-slate-500 block">({amountXlm} XLM)</span>
                </div>
              </div>

              {/* Reason Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Dispute Reason</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-red-500 font-medium"
                >
                  <option value="Damaged / Broken Inventory">Damaged / Broken Inventory</option>
                  <option value="Short Shipment (Missing SKUs)">Short Shipment (Missing SKUs)</option>
                  <option value="Expired / Bad Batch Products">Expired / Bad Batch Products</option>
                  <option value="Driver Delivered Wrong Items">Driver Delivered Wrong Items</option>
                  <option value="Delivery Not Completed">Delivery Not Completed</option>
                </select>
              </div>

              {/* Notes / Evidence Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Description & Evidence</label>
                <textarea
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Describe the issue (e.g. 2 boxes of coffee packets were water damaged during transit)..."
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-red-500 placeholder:text-slate-400"
                />
              </div>

              {/* Warning Notice */}
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Filing an on-chain dispute freezes escrow tokens in the Soroban smart contract, preventing unauthorized distributor withdrawals.
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="secondary"
                  onClick={onClose}
                  className="flex-1 text-xs py-2.5 rounded-xl border-slate-200 text-slate-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 text-xs py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center justify-center gap-1.5"
                >
                  {isSubmitting ? 'Locking Escrow...' : 'Submit Dispute'}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
