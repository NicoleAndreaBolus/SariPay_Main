'use client';

import { useState, useEffect, useCallback } from 'react';
import { connectFreighterWallet, getLiveBalance, awaitFreighterInjected } from '@/services/stellar';

export interface WalletState {
  walletAddress: string | null;
  walletBalance: string;
  isConnecting: boolean;
  debugStatus: string;
  authType: 'freighter' | 'passkey' | null;
}

export function useStellarWallet() {
  const [state, setState] = useState<WalletState>({
    walletAddress: null,
    walletBalance: '0.00',
    isConnecting: false,
    debugStatus: 'Initializing wallet system...',
    authType: null,
  });

  // Load from localStorage on mount (client-side only)
  useEffect(() => {
    const savedAddress = localStorage.getItem('saripay_wallet_address');
    const savedAuthType = localStorage.getItem('saripay_auth_type') as 'freighter' | 'passkey' | null;
    
    if (savedAddress && savedAuthType) {
      setState(prev => ({
        ...prev,
        walletAddress: savedAddress,
        authType: savedAuthType,
        debugStatus: `Restored session via ${savedAuthType === 'freighter' ? 'Freighter' : 'Passkey'}`,
      }));
    } else {
      // Check if Freighter is available
      awaitFreighterInjected()
        .then(hasFreighter => {
          setState(prev => ({
            ...prev,
            debugStatus: hasFreighter 
              ? 'Freighter wallet extension detected. Ready to link.'
              : 'Freighter extension not found. You can use Biometric Passkey onboarding.',
          }));
        });
    }
  }, []);

  // Fetch balance when address changes
  useEffect(() => {
    if (state.walletAddress) {
      if (state.authType === 'freighter') {
        // Query Stellar Horizon directly for Freighter balance
        getLiveBalance(state.walletAddress)
          .then(balance => {
            localStorage.setItem('saripay_wallet_balance', balance);
            setState(prev => ({ ...prev, walletBalance: balance }));
          })
          .catch(() => {
            setState(prev => ({ ...prev, walletBalance: '0.00 (Unfunded)' }));
          });
        return;
      }

      if (state.authType === 'passkey') {
        const savedBalance = localStorage.getItem('saripay_wallet_balance');
        if (savedBalance) {
          setState(prev => ({ ...prev, walletBalance: savedBalance }));
        } else {
          const initialPasskeyBalance = '150.00';
          localStorage.setItem('saripay_wallet_balance', initialPasskeyBalance);
          setState(prev => ({ ...prev, walletBalance: initialPasskeyBalance }));
        }
        return;
      }
    }
  }, [state.walletAddress, state.authType]);

  const linkFreighter = useCallback(async () => {
    setState(prev => ({ ...prev, isConnecting: true, debugStatus: 'Requesting Freighter authorization...' }));
    try {
      const address = await connectFreighterWallet();
      if (address) {
        localStorage.setItem('saripay_wallet_address', address);
        localStorage.setItem('saripay_auth_type', 'freighter');
        localStorage.removeItem('saripay_wallet_balance'); // Clear cached balance
        
        let balance = '0.00';
        try {
          balance = await getLiveBalance(address);
        } catch {
          balance = '0.00 (Unfunded)';
        }
        localStorage.setItem('saripay_wallet_balance', balance);

        setState(prev => ({
          ...prev,
          walletAddress: address,
          authType: 'freighter',
          walletBalance: balance,
          isConnecting: false,
          debugStatus: 'Freighter wallet linked successfully!',
        }));
        return address;
      } else {
        throw new Error('Connection resolved with empty address.');
      }
    } catch (error: any) {
      const errMsg = error?.message || String(error);
      setState(prev => ({
        ...prev,
        isConnecting: false,
        debugStatus: `Link Failed: ${errMsg}`,
      }));
      throw error;
    }
  }, []);

  const setupPasskey = useCallback(async () => {
    setState(prev => ({ ...prev, isConnecting: true, debugStatus: 'Initializing biometric credential creation...' }));
    try {
      // Simulate credential prompt wait
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a mock passkey address (Stellar style)
      const mockPasskeyAddress = 'GBPASSKEY' + Math.random().toString(36).substring(2, 15).toUpperCase() + 'SARIPAY';
      
      localStorage.setItem('saripay_wallet_address', mockPasskeyAddress);
      localStorage.setItem('saripay_auth_type', 'passkey');
      
      setState(prev => ({
        ...prev,
        walletAddress: mockPasskeyAddress,
        authType: 'passkey',
        walletBalance: '150.00', // Mock initial balance for passkey
        isConnecting: false,
        debugStatus: 'Biometric Passkey registered successfully!',
      }));
      return mockPasskeyAddress;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isConnecting: false,
        debugStatus: `Passkey setup aborted.`,
      }));
      throw error;
    }
  }, []);

  const disconnect = useCallback(() => {
    localStorage.removeItem('saripay_wallet_address');
    localStorage.removeItem('saripay_auth_type');
    setState({
      walletAddress: null,
      walletBalance: '0.00',
      isConnecting: false,
      debugStatus: 'Disconnected successfully.',
      authType: null,
    });
  }, []);

  return {
    ...state,
    linkFreighter,
    setupPasskey,
    disconnect,
    refreshBalance: async () => {
      if (state.walletAddress) {
        if (state.authType === 'freighter') {
          localStorage.removeItem('saripay_wallet_balance');
          const balance = await getLiveBalance(state.walletAddress);
          localStorage.setItem('saripay_wallet_balance', balance);
          setState(prev => ({ ...prev, walletBalance: balance }));
        } else {
          const val = localStorage.getItem('saripay_wallet_balance') || '150.00';
          setState(prev => ({ ...prev, walletBalance: val }));
        }
      }
    }
  };
}
