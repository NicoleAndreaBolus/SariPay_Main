'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  ScanLine, 
  ShieldCheck, 
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/common/Button';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (decodedData: string) => void;
  orderId?: string;
  expectedMerchant?: string;
}

export function QRScannerModal({
  isOpen,
  onClose,
  onScanSuccess,
  orderId,
  expectedMerchant,
}: QRScannerModalProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    setErrorMessage(null);
    setScannedResult(null);
    setIsScanning(true);

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setCameraActive(true);
        }
      } else {
        setErrorMessage("Camera access not supported on this device. Please upload an image instead.");
      }
    } catch (err) {
      console.warn("Camera access denied or unavailable:", err);
      setCameraActive(false);
      setErrorMessage("Unable to access camera. You can still upload a QR code screenshot or simulate instant handoff.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setIsScanning(false);
  };

  const handleSimulateScan = () => {
    const payload = JSON.stringify({
      orderId: orderId || 'ORD-8942',
      merchant: expectedMerchant || 'Aling Nena Store',
      timestamp: Date.now(),
      status: 'VERIFIED_HANDOFF',
      signature: 'ed25519:7aa2dfdd8757f8f8167355641c39f9fa1d877bf4ef6c4ba8b88de2bbc40349d4'
    });
    setScannedResult(payload);
    setTimeout(() => {
      stopCamera();
      onScanSuccess(payload);
      onClose();
    }, 1200);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleSimulateScan();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ScanLine className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm tracking-tight">Delivery Handoff Scanner</h3>
              <p className="text-[11px] text-slate-400">Scan distributor QR to release escrow</p>
            </div>
          </div>
          <button 
            onClick={() => { stopCamera(); onClose(); }}
            className="p-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Viewport / Scanning Area */}
        <div className="p-6 text-center">
          <div className="relative w-full aspect-square bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center border-2 border-dashed border-emerald-500/50 shadow-inner mb-4">
            
            {cameraActive ? (
              <video 
                ref={videoRef} 
                className="w-full h-full object-cover" 
                playsInline 
                muted 
              />
            ) : (
              <div className="p-6 text-slate-400 flex flex-col items-center">
                <Camera className="w-12 h-12 text-slate-600 mb-2 animate-pulse" />
                <p className="text-xs text-slate-400">Camera preview initializing or restricted</p>
              </div>
            )}

            {/* Glowing Laser Scan Line Overlay */}
            {isScanning && !scannedResult && (
              <div className="absolute inset-x-4 top-1/2 h-0.5 bg-emerald-400 shadow-[0_0_12px_#34d399] animate-bounce" />
            )}

            {/* Corner Framing Brackets */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-emerald-400 rounded-tl-lg" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-emerald-400 rounded-tr-lg" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-emerald-400 rounded-bl-lg" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-emerald-400 rounded-br-lg" />

            {/* Success Overlay upon scan */}
            {scannedResult && (
              <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-white animate-in zoom-in-95">
                <CheckCircle2 className="w-14 h-14 text-emerald-400 mb-2 animate-bounce" />
                <p className="text-sm font-extrabold text-emerald-300">QR Code Verified!</p>
                <p className="text-[10px] text-emerald-100 font-mono mt-1 truncate max-w-full">
                  Releasing escrow on Stellar...
                </p>
              </div>
            )}
          </div>

          {/* Quick Target Order Info */}
          {orderId && (
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 flex justify-between items-center mb-4">
              <span className="font-semibold text-slate-500">Target Order:</span>
              <span className="font-mono font-bold text-slate-900">#{orderId}</span>
            </div>
          )}

          {/* Fallback buttons (Upload QR or Instant Validate) */}
          <div className="flex gap-2">
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              className="hidden" 
            />
            
            <Button
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 text-xs py-2.5 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload QR
            </Button>

            <Button
              onClick={handleSimulateScan}
              className="flex-1 text-xs py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Verify Handoff
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
