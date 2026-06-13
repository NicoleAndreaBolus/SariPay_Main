'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, Fingerprint, Sparkles, Wallet, HelpCircle } from 'lucide-react';
import { useStellarWallet } from '@/hooks/useStellarWallet';
import { Button } from '@/components/common/Button';
import { LogoIcon, LogoLockup } from '@/components/common/Logo';

export default function LoginPage() {
  const router = useRouter();
  const { walletAddress, isConnecting, debugStatus, linkFreighter, setupPasskey } = useStellarWallet();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If already logged in, redirect directly to unified dashboard (or register if new user)
  useEffect(() => {
    if (walletAddress) {
      const savedWorkspaces = localStorage.getItem('saripay_workspaces');
      if (savedWorkspaces) {
        try {
          const parsed = JSON.parse(savedWorkspaces);
          const hasUserWorkspace = parsed && parsed.some((w: any) => w.walletAddress === walletAddress);
          if (hasUserWorkspace) {
            router.push('/dashboard');
            return;
          }
        } catch (e) {
          // Ignore
        }
      }
      router.push('/register');
    }
  }, [walletAddress, router]);

  const handleLinkFreighter = async () => {
    setErrorMessage(null);
    try {
      await linkFreighter();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to link Freighter wallet. Make sure it is installed and unlocked.');
    }
  };

  const handleLinkPasskey = async () => {
    setErrorMessage(null);
    try {
      await setupPasskey();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to authorize biometric passkey.');
    }
  };

  return (
    <main className="min-h-screen bg-[#FAFAF9] text-[#111827] flex flex-col justify-center items-center p-6 relative overflow-hidden font-sans">
      {/* Decorative gradient glowing spheres */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#059669]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-[#10B981]/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main card panel */}
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-[#E5E7EB] shadow-xl relative z-10 overflow-hidden flex flex-col text-left">
        {/* Border accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#059669]" />

        {/* Title Node */}
        <div className="flex flex-col items-center mb-8">
          <div className="mb-4">
            <LogoIcon size={52} />
          </div>
          <LogoLockup size={36} />
          <p className="text-[10px] text-[#059669] font-mono tracking-widest uppercase mt-1.5 font-bold">
            B2B Smart Escrow Authorization
          </p>
        </div>

        <p className="text-xs text-[#6B7280] text-center mb-6 px-2 leading-relaxed font-normal">
          Log in using your connected Freighter wallet or authenticate biometrically using your hardware passkey credentials.
        </p>

        {/* Interactive Actions */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={handleLinkFreighter}
            isLoading={isConnecting && debugStatus.includes('Freighter')}
            disabled={isConnecting}
            className="w-full h-12 flex items-center justify-center gap-2.5 text-sm font-semibold bg-[#059669] hover:bg-[#10B981] text-white"
          >
            <Wallet className="w-5 h-5 text-white" />
            Link Freighter Wallet
          </Button>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-[#E5E7EB]"></div>
            <span className="flex-shrink mx-4 text-[9px] text-stone-400 font-mono font-bold tracking-widest uppercase">Or Onboard Biometrics</span>
            <div className="flex-grow border-t border-[#E5E7EB]"></div>
          </div>

          <Button
            variant="secondary"
            onClick={handleLinkPasskey}
            isLoading={isConnecting && debugStatus.includes('biometric')}
            disabled={isConnecting}
            className="w-full h-12 flex items-center justify-center gap-2.5 text-sm border border-[#E5E7EB] hover:bg-stone-50 font-semibold text-[#111827]"
          >
            <Fingerprint className="w-5 h-5 text-[#059669] transition-transform" />
            Setup Biometric Passkey
          </Button>
        </div>

        {/* Error notification banner */}
        {errorMessage && (
          <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
            <p className="leading-relaxed font-semibold">{errorMessage}</p>
          </div>
        )}

        {/* Live System Log */}
        <div className="mt-6 pt-6 border-t border-[#E5E7EB] flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[10px] font-mono font-bold tracking-wider text-[#059669] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-ping" />
            Console Output
          </div>
          <div className="p-3 bg-[#FAFAF9] rounded-xl border border-[#E5E7EB] font-mono text-[11px] text-[#6B7280] leading-relaxed min-h-[46px] flex items-center">
            {debugStatus}
          </div>
        </div>
      </div>

      {/* Footer Info node */}
      <div className="absolute bottom-6 flex items-center gap-1.5 text-[10px] font-mono text-stone-400 font-semibold">
        <Sparkles className="w-3.5 h-3.5 text-[#059669]" />
        Runs on Stellar Horizon & Soroban Testnet Engine
      </div>
    </main>
  );
}
