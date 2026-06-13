'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Fingerprint, Sparkles, Store, Truck, ShieldAlert, ArrowRight } from 'lucide-react';
import { useStellarWallet } from '@/hooks/useStellarWallet';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Modal } from '@/components/common/Modal';
import { LogoIcon } from '@/components/common/Logo';
import { syncWithServer } from '@/utils/sync';
import confetti from 'canvas-confetti';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { walletAddress, isConnecting, debugStatus, setupPasskey } = useStellarWallet();

  // Wizard state: 'welcome' | 'selection' | 'details' | 'keyless'
  const [wizardStep, setWizardStep] = useState<'welcome' | 'selection' | 'details' | 'keyless'>('welcome');
  const [workspaceType, setWorkspaceType] = useState<'merchant' | 'distributor' | null>(null);
  
  // Workspace inputs
  const [workspaceName, setWorkspaceName] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [merchantLocation, setMerchantLocation] = useState('Manila, Philippines');
  const [distributorRegistryId, setDistributorRegistryId] = useState('SEC-REG-1029');
  
  const [formError, setFormError] = useState<string | null>(null);
  const [isOnboardingProgress, setIsOnboardingProgress] = useState(false);
  const [onboardingText, setOnboardingText] = useState('');
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);

  // Already logged in guard: redirect to dashboard only if they already have a registered workspace
  useEffect(() => {
    if (walletAddress && !isOnboardingProgress) {
      const savedWorkspaces = localStorage.getItem('saripay_workspaces');
      if (savedWorkspaces) {
        try {
          const parsed = JSON.parse(savedWorkspaces);
          if (parsed && parsed.length > 0) {
            router.push('/dashboard');
          }
        } catch (e) {
          // Ignore parse errors, let them register
        }
      }
    }
  }, [walletAddress, router, isOnboardingProgress]);

  const handleSelectWorkspaceType = (type: 'merchant' | 'distributor') => {
    setWorkspaceType(type);
    setWorkspaceName("");
    setWizardStep('details');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!userName.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!userEmail.trim() || !userEmail.includes('@')) {
      setFormError('Please enter a valid email address.');
      return;
    }
    if (!workspaceName.trim()) {
      setFormError('Please enter a business name for your workspace.');
      return;
    }

    // Trigger compliance consent modal before setupPasskey
    setIsConsentModalOpen(true);
  };

  const handleConfirmRegister = async () => {
    setIsConsentModalOpen(false);
    setIsOnboardingProgress(true);

    try {
      setOnboardingText('Initiating secure WebAuthn handshake...');
      await new Promise(resolve => setTimeout(resolve, 800));

      setOnboardingText('Verifying biometric device fingerprint...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      setOnboardingText('Generating cryptographic escrow credentials...');
      const address = await setupPasskey();
      
      if (address) {
        // Create User profile in localStorage and Users database
        const newUser = {
          id: `USR-${Date.now().toString().slice(-3)}-${Math.floor(Math.random() * 900 + 100)}`,
          name: userName.trim(),
          email: userEmail.trim().toLowerCase(),
          walletAddress: address,
          workspacesCount: 1,
          status: 'Active' as const,
          createdDate: new Date().toISOString().split('T')[0]
        };

        const existingUsers = JSON.parse(localStorage.getItem('saripay_users') || '[]');
        const updatedUsers = [...existingUsers.filter((u: any) => u.walletAddress !== address && u.email !== newUser.email), newUser];
        localStorage.setItem('saripay_users', JSON.stringify(updatedUsers));
        
        localStorage.setItem('saripay_profile_name', newUser.name);
        localStorage.setItem('saripay_profile_email', newUser.email);

        // Save workspaces list to LocalStorage
        const initialWorkspace = {
          id: `ws-${workspaceType}-${Date.now()}`,
          name: workspaceName.trim(),
          type: workspaceType,
          verificationStatus: 'Unverified',
          statusUpdatedAt: Date.now(),
          walletAddress: address
        };

        const initialWorkspaces = [initialWorkspace];
        
        localStorage.setItem('saripay_workspaces', JSON.stringify(initialWorkspaces));
        localStorage.setItem('saripay_active_workspace_id', initialWorkspace.id);
        localStorage.setItem('saripay_auth_role', workspaceType === 'distributor' ? 'supplier' : 'merchant');
        localStorage.setItem('saripay_wallet_balance', '150.00');

        // Sync with the shared server database immediately
        await syncWithServer();

        // Confetti explosion
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#059669', '#10B981', '#ffffff']
        });

        await new Promise(resolve => setTimeout(resolve, 800));
        router.push('/dashboard');
      }
    } catch (err: any) {
      setFormError(err?.message || 'Biometric passkey registration aborted.');
      setIsOnboardingProgress(false);
    }
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-3xl p-8 border border-[#E5E7EB] shadow-xl relative overflow-hidden flex flex-col text-left">
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#059669]" />

      {/* STEP 1: WELCOME SCREEN */}
      {wizardStep === 'welcome' && (
        <div className="flex flex-col items-center text-center py-6">
          <div className="mb-6">
            <LogoIcon size={64} />
          </div>
          <h2 className="text-2xl font-extrabold text-[#111827] tracking-tight mb-2">
            Welcome to SariPay
          </h2>
          <p className="text-sm text-[#6B7280] font-normal leading-relaxed max-w-sm mb-8">
            Let's create your first workspace. Start managing payments and delivery verification in minutes.
          </p>
          <Button
            onClick={() => setWizardStep('selection')}
            className="w-full h-12 flex items-center justify-center gap-2 font-semibold bg-[#059669] hover:bg-[#10B981] text-white rounded-xl"
          >
            Get Started
            <ArrowRight className="w-4.5 h-4.5" />
          </Button>
        </div>
      )}

      {/* STEP 2: WORKSPACE SELECTION STEP */}
      {wizardStep === 'selection' && (
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-xl font-bold text-[#111827] tracking-tight">
              What type of workspace would you like to create?
            </h2>
            <p className="text-xs text-[#6B7280] font-normal leading-relaxed mt-1">
              Choose the workspace that best matches how your business uses SariPay. You can always create additional workspaces later.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {/* Merchant Card */}
            <div 
              onClick={() => handleSelectWorkspaceType('merchant')}
              className="bg-white border border-[#E5E7EB] hover:border-[#059669] p-6 rounded-2xl cursor-pointer hover:shadow-md transition-all flex gap-4 items-start group"
            >
              <div className="w-10 h-10 rounded-lg bg-[#059669]/10 text-[#059669] flex items-center justify-center shrink-0">
                <Store className="w-5.5 h-5.5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#111827] group-hover:text-[#059669] transition-colors">Merchant Workspace</h4>
                <p className="text-xs text-[#6B7280] leading-relaxed mt-1 font-normal">
                  Buy inventory, fund escrows, verify deliveries, and manage supplier transactions.
                </p>
                <span className="text-[10px] text-stone-400 font-medium block mt-2">Examples: Sari-Sari Store, Retail Shop, Convenience Store, Restaurant</span>
              </div>
            </div>

            {/* Distributor Card */}
            <div 
              onClick={() => handleSelectWorkspaceType('distributor')}
              className="bg-white border border-[#E5E7EB] hover:border-[#059669] p-6 rounded-2xl cursor-pointer hover:shadow-md transition-all flex gap-4 items-start group"
            >
              <div className="w-10 h-10 rounded-lg bg-[#059669]/10 text-[#059669] flex items-center justify-center shrink-0">
                <Truck className="w-5.5 h-5.5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#111827] group-hover:text-[#059669] transition-colors">Distributor Workspace</h4>
                <p className="text-xs text-[#6B7280] leading-relaxed mt-1 font-normal">
                  Manage deliveries, track guaranteed revenue, verify orders, and receive escrow settlements.
                </p>
                <span className="text-[10px] text-stone-400 font-medium block mt-2">Examples: Wholesaler, Distributor, Supplier, Logistics Partner</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-[#E5E7EB] pt-4 mt-2">
            <button
              onClick={() => setWizardStep('welcome')}
              className="text-xs font-semibold text-[#6B7280] hover:text-[#111827]"
            >
              Back
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: DETAILS & PASSKEY GENERATOR */}
      {wizardStep === 'details' && (
        <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-5">
          <div>
            <h2 className="text-xl font-bold text-[#111827] tracking-tight">
              Create your {workspaceType === 'merchant' ? 'Merchant' : 'Distributor'} Workspace
            </h2>
            <p className="text-xs text-[#6B7280] font-normal mt-1">
              Give your workspace a name to identify your store or distribution outlet.
            </p>
          </div>

          {isOnboardingProgress ? (
            <div className="flex flex-col items-center justify-center py-12 text-center min-h-[220px] gap-4">
              <div className="relative w-16 h-16 bg-[#059669]/10 rounded-full flex items-center justify-center border border-[#059669]/30">
                <Fingerprint className="w-8 h-8 text-[#059669] animate-pulse" />
                <div className="absolute inset-0 border-2 border-dashed border-[#059669] rounded-full animate-spin duration-3000" />
              </div>
              <h3 className="text-base font-bold text-[#111827]">Registering Secure Credentials</h3>
              <p className="text-xs font-mono text-[#059669] animate-pulse font-bold">{onboardingText}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <Input
                label="Full Name"
                placeholder="e.g. John Doe"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                id="onboarding-register-user-name"
              />

              <Input
                label="Email Address"
                placeholder="e.g. john@example.com"
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                id="onboarding-register-user-email"
              />

              <Input
                label="Workspace Business Name"
                placeholder={workspaceType === 'merchant' ? "e.g. John's Mini Mart" : "e.g. Santos Distribution"}
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                id="onboarding-register-ws-name"
              />

              {workspaceType === 'merchant' ? (
                <Input
                  label="Merchant Store Location"
                  placeholder="e.g. San Fernando, Pampanga"
                  value={merchantLocation}
                  onChange={(e) => setMerchantLocation(e.target.value)}
                  id="onboarding-register-merchant-location"
                />
              ) : (
                <Input
                  label="SEC Corporate Registry ID"
                  placeholder="e.g. SEC-REG-10294"
                  value={distributorRegistryId}
                  onChange={(e) => setDistributorRegistryId(e.target.value)}
                  id="onboarding-register-dist-sec"
                />
              )}

              {formError && (
                <p className="text-xs text-red-500 font-semibold flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-red-500" />
                  {formError}
                </p>
              )}

              <div className="flex justify-between items-center border-t border-[#E5E7EB] pt-5 mt-4">
                <button
                  type="button"
                  onClick={() => setWizardStep('selection')}
                  className="text-xs font-semibold text-[#6B7280] hover:text-[#111827]"
                >
                  Back
                </button>
                <Button
                  type="submit"
                  className="bg-[#059669] hover:bg-[#10B981] text-white text-xs font-bold py-2.5 px-5 rounded-xl flex items-center gap-1.5"
                >
                  <Fingerprint className="w-4.5 h-4.5" />
                  Setup Passkey & Launch
                </Button>
              </div>
            </div>
          )}

          {/* Biometrics Log Status */}
          <div className="mt-4 pt-4 border-t border-[#E5E7EB] flex flex-col gap-2.5">
            <div className="flex items-center gap-1 text-[10px] font-mono font-bold tracking-wider text-[#059669] uppercase">
              <span className="w-1.5 h-1.5 bg-[#059669] rounded-full animate-ping" />
              Hardware Key Logs
            </div>
            <div className="p-3 bg-[#FAFAF9] rounded-xl border border-[#E5E7EB] font-mono text-[10.5px] text-[#6B7280] min-h-[46px] flex items-center leading-relaxed">
              {debugStatus}
            </div>
          </div>

        </form>
      )}

      <Modal
        isOpen={isConsentModalOpen}
        onClose={() => setIsConsentModalOpen(false)}
        title="Information Sharing Agreement"
      >
        <div className="flex flex-col gap-4 text-stone-600 text-xs leading-relaxed font-sans text-left">
          <p>
            In compliance with platform transparency and B2B KYC rules, we require your consent to store and share your business workspace details, full name, and email address with platform compliance administrators.
          </p>
          <p className="font-bold text-stone-800">
            Do you consent to share this profile information and proceed with Passkey registration?
          </p>
          <div className="flex justify-end gap-2.5 pt-3.5 border-t border-slate-100 mt-2">
            <Button
              variant="ghost"
              onClick={() => setIsConsentModalOpen(false)}
              className="py-2 px-4 rounded-xl text-stone-500 font-semibold cursor-pointer text-xs"
            >
              No, Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirmRegister}
              className="bg-[#059669] hover:bg-[#10B981] text-white font-bold py-2 px-4 rounded-xl cursor-pointer text-xs"
            >
              Yes, I Consent
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF9] text-[#111827] flex flex-col justify-center items-center p-6 relative overflow-hidden font-sans">
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#059669]/5 rounded-full blur-[120px] pointer-events-none" />
      
      <Suspense fallback={
        <div className="animate-pulse flex flex-col items-center gap-3 relative z-10">
          <div className="w-10 h-10 border-4 border-[#059669] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-mono text-[#059669] font-bold">Loading secure onboarding...</span>
        </div>
      }>
        <RegisterForm />
      </Suspense>

      <div className="absolute bottom-6 flex items-center gap-1.5 text-[10px] font-mono text-stone-400 font-semibold">
        <Sparkles className="w-3.5 h-3.5 text-[#059669] animate-pulse" />
        Hardware key verification module active
      </div>
    </main>
  );
}
