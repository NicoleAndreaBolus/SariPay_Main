'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, ChevronRight, Package, QrCode, ShieldCheck, Sparkles, Truck, Lock, ShieldAlert, AlertCircle } from 'lucide-react';
import { useSariPayContract, Order } from '@/hooks/useSariPayContract';
import { useStellarWallet } from '@/hooks/useStellarWallet';
import { Button } from '@/components/common/Button';
import { QRGenerator } from '@/components/qr/QRGenerator';
import { QRScanner } from '@/components/qr/QRScanner';
import { Modal } from '@/components/common/Modal';
import confetti from 'canvas-confetti';

export default function OrderDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const wallet = useStellarWallet();
  const { orders, fundOrder, confirmDelivery, getOrder } = useSariPayContract();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [isFunding, setIsFunding] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isWorkspaceVerified, setIsWorkspaceVerified] = useState(true);
  const [workspaceType, setWorkspaceType] = useState<'merchant' | 'distributor' | null>(null);

  const [alertConfig, setAlertConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'info' | 'error' | 'success';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  const triggerAlert = (message: string, title = 'Notice', type: 'info' | 'error' | 'success' = 'info') => {
    setAlertConfig({
      isOpen: true,
      title,
      message,
      type
    });
  };

  // Authenticate user & check workspace verification status
  useEffect(() => {
    const address = localStorage.getItem('saripay_wallet_address');
    if (!address) {
      router.push('/login');
      return;
    }

    const savedWorkspaces = localStorage.getItem('saripay_workspaces');
    const savedActiveId = localStorage.getItem('saripay_active_workspace_id');
    if (savedWorkspaces && savedActiveId) {
      try {
        const parsed = JSON.parse(savedWorkspaces);
        const active = parsed.find((w: any) => w.id === savedActiveId);
        if (active) {
          setIsWorkspaceVerified(active.verificationStatus === 'Verified');
          setWorkspaceType(active.type);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [router]);

  // Fetch target order details from local state or ledger
  useEffect(() => {
    const loadOrderData = async () => {
      if (!id) return;

      // Try local cache first
      const found = orders.find((o) => o.id === id);
      if (found) {
        setOrder(found);
        return;
      }

      // Fetch from ledger if not in local cache
      if (wallet.walletAddress) {
        const ledgerOrder = await getOrder(id, wallet.walletAddress);
        if (ledgerOrder) {
          setOrder(ledgerOrder);
        }
      }
    };

    loadOrderData();
  }, [orders, id, wallet.walletAddress, getOrder]);

  const handleLockEscrow = async () => {
    if (!order) return;
    if (!isWorkspaceVerified) {
      triggerAlert("Verification Required: Your active workspace must be Verified by admin to fund escrows.", "Verification Required", "error");
      return;
    }
    setIsFunding(true);
    try {
      const result = await fundOrder(order.id, wallet.walletBalance, wallet.walletAddress);
      if (result.success) {
        localStorage.setItem('saripay_wallet_balance', result.newBalance);
        await wallet.refreshBalance();
      }
    } catch (err: any) {
      triggerAlert(err?.message || "Failed to lock escrow funds.", "Error", "error");
    } finally {
      setIsFunding(false);
    }
  };

  const handleScanSuccess = async (scannedData: string) => {
    if (!order) return;
    setIsScanModalOpen(false);
    setIsConfirming(true);
    
    try {
      // Release payout
      const success = await confirmDelivery(order.id, wallet.walletAddress);
      if (success) {
        // Trigger celebratory confetti effect
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#10B981', '#34D399', '#059669', '#34d399', '#ffffff']
        });
      }
    } catch (err: any) {
      triggerAlert(err?.message || "Failed to verify supply package.", "Error", "error");
    } finally {
      setIsConfirming(false);
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-[#0B1411] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-mono text-emerald-500 font-bold">Querying ledger records...</span>
        </div>
      </div>
    );
  }

  // Define steps for progress indicator
  const steps = [
    { label: 'Order Registered', status: 'Initialized', icon: Package },
    { label: 'Escrow Funded', status: 'Funded', icon: Lock },
    { label: 'Payout Released', status: 'Delivered', icon: CheckCircle2 },
  ];

  const currentStepIndex = steps.findIndex(s => s.status === order.status);

  return (
    <main className="min-h-screen bg-[#0B1411] text-[#F3F4F6] p-6 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-3xl mx-auto flex flex-col gap-6 relative z-10">
        
        {/* Navigation and Title Header */}
        <header className="flex items-center gap-4 border-b border-emerald-950/20 pb-6">
          <Link href="/dashboard" passHref>
            <Button variant="secondary" className="!p-2 rounded-xl">
              <ArrowLeft className="w-5 h-5 text-emerald-400" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Order #{order.id}</h1>
            <p className="text-xs text-gray-400 mt-1">Escrow Tracking & Delivery Hub</p>
          </div>
        </header>

        {/* Dynamic Step Progress Tracker */}
        <section className="bg-[#12221D] rounded-2xl p-6 border border-emerald-950/60 shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative">
            
            {steps.map((step, idx) => {
              const StepIcon = step.icon;
              const isCompleted = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              
              return (
                <React.Fragment key={step.status}>
                  {idx > 0 && (
                    <div className="hidden md:block flex-1 h-0.5 bg-emerald-950 mx-2 relative">
                      <div 
                        className="absolute inset-0 bg-emerald-500 transition-all duration-500" 
                        style={{ width: idx <= currentStepIndex ? '100%' : '0%' }}
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300 ${
                      isCompleted 
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-md shadow-emerald-500/5' 
                        : 'bg-[#0B1411]/50 border-emerald-950 text-gray-600'
                    }`}>
                      <StepIcon className={`w-5 h-5 ${isCurrent ? 'animate-pulse' : ''}`} />
                    </div>
                    <div>
                      <p className={`text-xs font-semibold ${isCompleted ? 'text-white' : 'text-gray-500'}`}>{step.label}</p>
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5">{step.status}</p>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}

          </div>
        </section>

        {/* Dual Panel Details / Scan Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Order Details Panel */}
          <section className="bg-[#12221D] rounded-2xl p-6 border border-emerald-950/60 shadow-lg flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Shipment Records</h3>
              <div className="flex flex-col gap-4 font-sans text-sm">
                <div>
                  <span className="text-xs text-gray-500 font-semibold block">SUPPLIER</span>
                  <span className="font-semibold text-white mt-1 block">{order.supplier}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 font-semibold block">DATE REGISTERED</span>
                  <span className="font-mono text-white mt-1 block">{order.date}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 font-semibold block">SHIPMENT DETAILS</span>
                  <span className="text-gray-300 mt-1 block leading-relaxed">{order.details}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-emerald-950/20 pt-4 mt-6">
              <span className="text-xs text-gray-500 font-semibold block">ESCROW CAPITAL</span>
              <span className="text-2xl font-mono font-bold text-white mt-1 block">
                {order.amount} <span className="text-xs text-emerald-500 font-semibold">XLM</span>
              </span>
            </div>
          </section>

          {/* Verification Panel */}
          <section className="flex flex-col justify-center">
            {order.status === 'Initialized' && (
              <div className="bg-[#12221D] rounded-2xl p-6 border border-emerald-950/60 shadow-lg text-center flex flex-col items-center gap-4 justify-center min-h-[300px]">
                <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center border border-yellow-500/20 text-yellow-400">
                  <Lock className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-white">Escrow Payment Required</h4>
                <p className="text-xs text-gray-400 leading-relaxed max-w-[220px]">
                  Lock {order.amount} XLM into the secure escrow contract to authorize supplier packaging.
                </p>
                <Button
                  variant="primary"
                  onClick={handleLockEscrow}
                  isLoading={isFunding}
                  disabled={!isWorkspaceVerified}
                  className="w-full flex items-center justify-center gap-2 mt-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Lock Escrow Funds
                </Button>
                {!isWorkspaceVerified && (
                  <p className="text-[10px] text-amber-500 font-semibold bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-xl mt-1 max-w-[240px] leading-normal">
                    ⚠️ Verification Required: Your active workspace must be Verified by admin to fund escrows.
                  </p>
                )}
              </div>
            )}

            {order.status === 'Funded' && (
              <div className="flex flex-col gap-4">
                {workspaceType === 'distributor' ? (
                  <>
                    {/* QR Code display for Distributor to show the Merchant */}
                    <QRGenerator value={order.id} />
                    <div className="text-center p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                      <p className="text-xs text-gray-300 font-semibold leading-relaxed">
                        Show this Handoff QR code to the Merchant. They will scan it using their SariPay wallet to release the locked escrow payment to your account.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Scanner action for Merchant to scan the Distributor's code */}
                    <div className="text-center p-4 bg-yellow-500/10 rounded-2xl border border-yellow-500/20 mb-2">
                      <p className="text-xs text-gray-300 font-semibold leading-relaxed">
                        Scan the distributor's cargo handoff QR code to confirm delivery and authorize releasing the escrow payout on-chain.
                      </p>
                    </div>
                    <Button
                      variant="primary"
                      onClick={() => setIsScanModalOpen(true)}
                      isLoading={isConfirming}
                      className="w-full h-12 flex items-center justify-center gap-2"
                    >
                      <QrCode className="w-5 h-5 text-[#0B1411]" />
                      Scan Distributor Handoff Code
                    </Button>
                  </>
                )}
              </div>
            )}

            {order.status === 'Delivered' && (
              <div className="bg-emerald-500/10 rounded-2xl p-6 border border-emerald-500/20 text-center flex flex-col items-center gap-4 justify-center min-h-[300px] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl" />
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/30 text-emerald-400 shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-emerald-400">Delivery Confirmed</h4>
                <p className="text-xs text-gray-400 leading-relaxed max-w-[240px]">
                  Supply box scanned successfully. The escrow contract has safely released the payout to the supplier.
                </p>
                <div className="bg-[#0B1411]/50 border border-emerald-950 px-4 py-2 rounded-xl text-[10px] font-mono text-gray-400 tracking-wide mt-2">
                  Tx ID: TX-SOROBAN-RELEASE-{order.id}
                </div>
              </div>
            )}
          </section>
        </div>

      </div>

      {/* QR Scanner modal overlay */}
      <Modal
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
        title="Verify Package Handoff"
      >
        <QRScanner 
          onScanSuccess={handleScanSuccess}
          expectedValue={order.id}
        />
      </Modal>

      {/* SYSTEM ALERT MODAL (RESPONSIVE) */}
      <Modal
        isOpen={alertConfig.isOpen}
        onClose={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
        title={alertConfig.title}
      >
        <div className="flex flex-col gap-4 text-left p-2 text-[#F3F4F6]">
          <div className="flex items-start gap-3.5">
            {alertConfig.type === 'error' && (
              <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0 text-red-400">
                <ShieldAlert className="w-5.5 h-5.5" />
              </div>
            )}
            {alertConfig.type === 'success' && (
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400">
                <CheckCircle2 className="w-5.5 h-5.5" />
              </div>
            )}
            {alertConfig.type === 'info' && (
              <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 text-blue-400">
                <AlertCircle className="w-5.5 h-5.5" />
              </div>
            )}
            <div className="flex-1">
              <p className="text-xs text-gray-300 font-normal leading-relaxed mt-1">
                {alertConfig.message}
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-2 pt-4 border-t border-emerald-950/20">
            <Button
              variant="primary"
              onClick={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
              className="bg-emerald-600 hover:bg-emerald-500 text-xs font-bold py-2.5 px-6 rounded-xl cursor-pointer text-white"
            >
              Okay, Got it
            </Button>
          </div>
        </div>
      </Modal>
    </main>
  );
}
