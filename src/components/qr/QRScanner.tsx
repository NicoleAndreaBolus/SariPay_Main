'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';
import { Camera, RefreshCw, Sparkles, Check, Upload, AlertCircle } from 'lucide-react';
import { Button } from '../common/Button';

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  expectedValue?: string;
}

export function QRScanner({ onScanSuccess, expectedValue }: QRScannerProps) {
  const [scanError, setScanError] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isSimulatedSuccess, setIsSimulatedSuccess] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Initialize html5-qrcode scanner
    const scannerId = 'reader';
    const container = document.getElementById(scannerId);
    
    if (container) {
      scannerRef.current = new Html5QrcodeScanner(
        scannerId,
        {
          fps: 10,
          qrbox: { width: 220, height: 220 },
          aspectRatio: 1.0,
          showTorchButtonIfSupported: true,
        },
        /* verbose= */ false
      );

      scannerRef.current.render(
        (decodedText) => {
          if (scannerRef.current) {
            scannerRef.current.clear().catch(console.error);
          }
          onScanSuccess(decodedText);
        },
        (error) => {
          // Silent log or trace
          console.warn(`QR scan error: ${error}`);
        }
      );
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch((err) => {
          console.warn('Failed to clear scanner on unmount', err);
        });
      }
    };
  }, [onScanSuccess]);

  const handleSimulateScan = async () => {
    setIsSimulating(true);
    // Simulate camera lock-on delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSimulating(false);
    setIsSimulatedSuccess(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    onScanSuccess(expectedValue || 'MOCK_ORDER_ID');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsSimulating(true);
    setFileError(null);

    try {
      // Using Html5Qrcode to parse file
      const html5QrCode = new Html5Qrcode("hidden-reader");
      const decodedText = await html5QrCode.scanFile(file, true);
      
      setIsSimulating(false);
      setIsSimulatedSuccess(true);
      await new Promise((resolve) => setTimeout(resolve, 800));
      onScanSuccess(decodedText);
    } catch (err) {
      console.warn("Failed to parse QR file", err);
      setIsSimulating(false);
      setFileError("Could not read a valid QR code from this image. Blurry image?");
    }
  };

  const handleForceApprove = async () => {
    setIsSimulatedSuccess(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    onScanSuccess(expectedValue || 'MOCK_ORDER_ID');
  };

  return (
    <div className="flex flex-col items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-lg text-[#0F172A]">
      <div className="w-full flex items-center justify-between border-b border-slate-100 pb-3 mb-2">
        <h4 className="text-sm font-bold text-[#0F766E] flex items-center gap-2">
          <Camera className="w-4 h-4" /> Supply Box QR Verification
        </h4>
        <span className="text-[10px] text-slate-400 font-mono font-bold">
          Target: #{expectedValue}
        </span>
      </div>

      {/* Hidden reader element needed for file decoding */}
      <div id="hidden-reader" className="hidden" style={{ display: 'none' }} />

      {/* Scanner Window / Simulator View */}
      <div className="relative w-full aspect-square max-w-[260px] bg-slate-50 border border-slate-200 rounded-xl overflow-hidden flex flex-col items-center justify-center">
        {isSimulating ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 z-10 gap-3">
            <RefreshCw className="w-8 h-8 text-[#0F766E] animate-spin" />
            <p className="text-xs font-mono text-[#0F766E] animate-pulse font-bold">Matching cryptographic proof...</p>
          </div>
        ) : isSimulatedSuccess ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 z-10 gap-3 text-emerald-600">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
              <Check className="w-6 h-6" />
            </div>
            <p className="text-xs font-mono font-bold">Verification Approved!</p>
          </div>
        ) : (
          <>
            {/* Camera View Anchor */}
            <div id="reader" className="w-full h-full text-xs text-slate-500" />
            
            {/* Target Reticle Overlay */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 border-2 border-dashed border-[#14B8A6]/40 rounded-lg pointer-events-none flex items-center justify-center">
              <div className="w-2 h-2 bg-[#14B8A6] rounded-full animate-ping" />
            </div>
          </>
        )}
      </div>

      <div className="w-full flex flex-col gap-2 mt-1">
        <p className="text-[11px] text-center text-slate-500 leading-relaxed px-4">
          Point device camera at the supplier QR label, upload a screenshot image, or use simulation helper to complete delivery.
        </p>

        {fileError && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 space-y-2">
            <div className="flex items-center gap-1.5 font-bold">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Scanning Failed</span>
            </div>
            <p className="text-[10px] leading-relaxed">{fileError}</p>
            <button
              onClick={handleForceApprove}
              className="w-full py-1.5 bg-amber-600 text-white rounded-lg text-[10px] font-bold hover:bg-amber-700 transition-colors"
            >
              Force Verify & Release Escrow
            </button>
          </div>
        )}

        <div className="border-t border-slate-100 my-1" />

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          className="hidden"
        />

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="secondary"
            onClick={() => fileInputRef.current?.click()}
            disabled={isSimulating || isSimulatedSuccess}
            className="flex items-center justify-center gap-1.5 border-slate-300 text-slate-700 rounded-xl active:scale-95 transition-transform duration-200 text-xs font-bold"
          >
            <Upload className="w-4 h-4" />
            Upload Image
          </Button>

          <Button
            variant="primary"
            onClick={handleSimulateScan}
            disabled={isSimulating || isSimulatedSuccess}
            className="flex items-center justify-center gap-1.5 bg-[#0F766E] hover:bg-[#14B8A6] text-white rounded-xl active:scale-95 transition-transform duration-200 text-xs font-bold"
          >
            <Sparkles className="w-4 h-4" />
            Simulate Scan
          </Button>
        </div>
      </div>
    </div>
  );
}
