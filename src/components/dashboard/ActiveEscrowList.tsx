'use client';

import React, { useState } from 'react';
import { Order } from '@/hooks/useSariPayContract';
import { OrderCard } from './OrderCard';
import { Filter } from 'lucide-react';

interface ActiveEscrowListProps {
  orders: Order[];
  onFund: (id: string) => void;
  fundingId: string | null;
}

export function ActiveEscrowList({ orders, onFund, fundingId }: ActiveEscrowListProps) {
  const [activeTab, setActiveTab] = useState<'All' | 'Initialized' | 'Funded' | 'Delivered'>('All');

  const tabs: ('All' | 'Initialized' | 'Funded' | 'Delivered')[] = [
    'All',
    'Initialized',
    'Funded',
    'Delivered',
  ];

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'All') return true;
    return order.status === activeTab;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Tabs Container */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#12221D]/40 p-2 rounded-2xl border border-emerald-950/20">
        <div className="flex flex-wrap gap-1 w-full sm:w-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-emerald-500 text-[#0B1411] shadow-md font-bold'
                  : 'text-gray-400 hover:text-white hover:bg-emerald-950/20'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2 text-xs font-mono text-gray-500 font-bold self-end sm:self-auto pr-2">
          <Filter className="w-3.5 h-3.5 text-gray-600" />
          Showing {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'}
        </div>
      </div>

      {/* Orders Stack */}
      <div className="grid gap-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onFund={onFund}
              isFunding={fundingId === order.id}
            />
          ))
        ) : (
          <div className="bg-[#12221D]/20 rounded-2xl border border-dashed border-emerald-950/40 p-12 text-center">
            <p className="text-sm text-gray-500 font-semibold">No shipment orders found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
