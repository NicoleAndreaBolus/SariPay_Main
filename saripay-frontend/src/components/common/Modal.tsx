'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#000000]/70 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      {/* Content Container */}
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200 text-[#0F172A]">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <h3 className="text-lg font-bold text-[#0F172A] tracking-tight">{title}</h3>
          <Button variant="ghost" size="sm" onClick={onClose} className="!p-1 rounded-xl">
            <X className="w-5 h-5 text-slate-400 hover:text-slate-800" />
          </Button>
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>
  );
}
