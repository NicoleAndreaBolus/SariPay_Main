'use client';

import React from 'react';
import { Wallet, LogOut, RefreshCw } from 'lucide-react';
import { shortenAddress } from '@/utils/address';
import { Button } from '../common/Button';

interface BalanceWidgetProps {
  walletAddress: string;
  walletBalance: string;
  authType: 'freighter' | 'passkey' | null;
  onDisconnect: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export function BalanceWidget({
  walletAddress,
  walletBalance,
  authType,
  onDisconnect,
  onRefresh,
  isRefreshing = false,
}: BalanceWidgetProps) {
  return (
    <div className="bg-[#12221D] rounded-2xl p-6 border border-emerald-950/60 shadow-xl relative overflow-hidden group">
      {/* Background accents */}
      <div className="absolute -right-16 -top-16 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all duration-300" />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
            <Wallet className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-gray-400 font-mono font-bold">
                {shortenAddress(walletAddress)}
              </span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/20">
                {authType === 'passkey' ? 'Passkey Auth' : 'Freighter'}
              </span>
            </div>
            <p className="text-2xl font-mono font-bold text-white mt-1">
              {walletBalance} <span className="text-sm font-semibold text-emerald-500">XLM</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Button
            variant="secondary"
            size="sm"
            onClick={onRefresh}
            isLoading={isRefreshing}
            className="!p-2 rounded-xl"
            title="Refresh balance"
          >
            <RefreshCw className={`w-4 h-4 text-emerald-400 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={onDisconnect}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Disconnect
          </Button>
        </div>
      </div>
    </div>
  );
}
