'use client';

import React from 'react';
import { QrCode } from 'lucide-react';

interface QRGeneratorProps {
  value: string;
  size?: number;
}

export function QRGenerator({ value, size = 180 }: QRGeneratorProps) {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&color=0f766e&bgcolor=ffffff&data=${encodeURIComponent(value)}`;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-slate-200 shadow-lg text-[#0F172A]">
      <div className="relative p-3 bg-white rounded-xl border border-slate-200">
        {/* Corner brackets */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#0F766E] rounded-tl" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#0F766E] rounded-tr" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#0F766E] rounded-bl" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#0F766E] rounded-br" />
        
        {/* QR Code image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrUrl}
          alt={`QR Code for ${value}`}
          width={size}
          height={size}
          className="rounded-lg opacity-90 hover:opacity-100 transition-opacity"
        />
      </div>
      <span className="text-[10px] font-mono text-slate-500 mt-4 uppercase tracking-wider flex items-center gap-1.5 font-bold">
        <QrCode className="w-3 h-3 text-[#14B8A6]" />
        Secure Escrow QR Code #{value}
      </span>
    </div>
  );
}
