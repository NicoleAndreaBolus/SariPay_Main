'use client';

import React from 'react';
import Link from 'next/link';
import { Truck, CheckCircle, Package, ArrowRight, ShieldCheck } from 'lucide-react';
import { Order } from '@/hooks/useSariPayContract';
import { Button } from '../common/Button';

interface OrderCardProps {
  order: Order;
  onFund?: (id: string) => void;
  isFunding?: boolean;
}

export function OrderCard({ order, onFund, isFunding = false }: OrderCardProps) {
  const getStatusStyle = (status: Order['status']) => {
    switch (status) {
      case 'Initialized':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'Funded':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Delivered':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Canceled':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'Initialized':
        return <Package className="w-4 h-4" />;
      case 'Funded':
        return <Truck className="w-4 h-4 animate-pulse" />;
      case 'Delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'Canceled':
        return <CheckCircle className="w-4 h-4 text-red-400" />;
    }
  };

  return (
    <div className="bg-[#12221D] rounded-xl p-5 border border-emerald-950/40 hover:border-emerald-500/20 transition-all duration-300 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group">
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono bg-[#0B1411] px-2 py-1 rounded text-emerald-400 border border-emerald-950/50">
            #{order.id}
          </span>
          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border flex items-center gap-1.5 ${getStatusStyle(order.status)}`}>
            {getStatusIcon(order.status)}
            {order.status}
          </span>
          <span className="text-xs text-gray-500 font-mono hidden md:inline">
            {order.date}
          </span>
        </div>
        <h4 className="font-semibold text-white mt-2 group-hover:text-emerald-400 transition-colors">
          {order.supplier}
        </h4>
        <p className="text-xs text-gray-400 mt-1 line-clamp-1">{order.details}</p>
      </div>

      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t border-emerald-950/20 sm:border-0 pt-3 sm:pt-0">
        <div className="text-left sm:text-right">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Amount</p>
          <p className="text-lg font-mono font-bold text-white mt-0.5">
            {order.amount} <span className="text-xs font-semibold text-emerald-500">XLM</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {order.status === 'Initialized' && onFund && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onFund(order.id)}
              isLoading={isFunding}
              className="flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" /> Lock Escrow
            </Button>
          )}

          <Link href={`/order/${order.id}`} passHref>
            <Button
              variant="secondary"
              size="sm"
              className="flex items-center gap-1 group/btn"
            >
              Details
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
