'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Package, AlertTriangle, CheckCircle2, RefreshCw, Plus, Minus, Sparkles, Scan, Truck, TrendingDown } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { LogoLockup } from '@/components/common/Logo';
import confetti from 'canvas-confetti';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  maxCapacity: number;
  reorderLevel: number;
  unitPricePhp: number;
  unitPriceXlm: number;
  supplier: string;
  sku: string;
}

const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'SKU-001', name: 'Sinandomeng Rice 25kg Sack', category: 'Grains & Staples', currentStock: 3, maxCapacity: 20, reorderLevel: 5, unitPricePhp: 1250, unitPriceXlm: 200, supplier: 'Santos Wholesale Supply', sku: '4800016644201' },
  { id: 'SKU-002', name: 'Great Taste White Coffee (Pack of 100)', category: 'Beverages', currentStock: 4, maxCapacity: 30, reorderLevel: 8, unitPricePhp: 550, unitPriceXlm: 88, supplier: 'Universal Robina FMCG Depot', sku: '4800016644218' },
  { id: 'SKU-003', name: 'Lucky Me! Pancit Canton Kalamansi (Box of 72)', category: 'Instant Meals', currentStock: 6, maxCapacity: 25, reorderLevel: 10, unitPricePhp: 850, unitPriceXlm: 136, supplier: 'Monde Nissin Distribution', sku: '4800016644225' },
  { id: 'SKU-004', name: '555 Sardines in Tomato Sauce (Box of 50)', category: 'Canned Goods', currentStock: 12, maxCapacity: 30, reorderLevel: 8, unitPricePhp: 1100, unitPriceXlm: 176, supplier: 'Century Pacific Logistics', sku: '4800016644232' },
  { id: 'SKU-005', name: 'Golden Fiesta Cooking Oil 1L (Case of 12)', category: 'Cooking Essentials', currentStock: 5, maxCapacity: 15, reorderLevel: 6, unitPricePhp: 980, unitPriceXlm: 156.8, supplier: 'Peerless FMCG Hub', sku: '4800016644249' },
  { id: 'SKU-006', name: 'Bear Brand Fortified Milk Powder (Box of 48)', category: 'Dairy', currentStock: 18, maxCapacity: 30, reorderLevel: 10, unitPricePhp: 1450, unitPriceXlm: 232, supplier: 'Nestle Trade Depot', sku: '4800016644256' }
];

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [isReplenishing, setIsReplenishing] = useState(false);
  const [replenishSuccess, setReplenishSuccess] = useState(false);

  const lowStockItems = inventory.filter(item => item.currentStock <= item.reorderLevel);
  const totalRestockPhp = lowStockItems.reduce((acc, item) => acc + ((item.maxCapacity - item.currentStock) * item.unitPricePhp), 0);
  const totalRestockXlm = (totalRestockPhp * 0.16).toFixed(1);

  const handleAdjustStock = (id: string, delta: number) => {
    setInventory(prev => prev.map(item => {
      if (item.id === id) {
        const nextStock = Math.max(0, Math.min(item.maxCapacity, item.currentStock + delta));
        return { ...item, currentStock: nextStock };
      }
      return item;
    }));
  };

  const handleSimulatePOSSale = () => {
    setInventory(prev => prev.map(item => {
      const sold = Math.floor(Math.random() * 2) + 1;
      return { ...item, currentStock: Math.max(0, item.currentStock - sold) };
    }));
    alert('Simulated POS checkout: retail items sold and shelf count decremented!');
  };

  const handleAutoReplenish = () => {
    setIsReplenishing(true);
    setTimeout(() => {
      setIsReplenishing(false);
      setReplenishSuccess(true);
      setInventory(prev => prev.map(item => {
        if (item.currentStock <= item.reorderLevel) {
          return { ...item, currentStock: item.maxCapacity };
        }
        return item;
      }));
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      setTimeout(() => setReplenishSuccess(false), 5000);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 selection:bg-emerald-500 selection:text-white">
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <LogoLockup size={36} />
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <Link href="/dashboard/customer" className="hover:text-emerald-400 transition-colors">Merchant Dashboard</Link>
            <Link href="/dashboard/supplier" className="hover:text-emerald-400 transition-colors">Distributor Dashboard</Link>
            <Link href="/inventory" className="text-emerald-400 font-semibold flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
              <Package className="w-3.5 h-3.5" /> Smart Inventory
            </Link>
            <Link href="/credit" className="hover:text-emerald-400 transition-colors">SariCredit™</Link>
            <Link href="/invoice" className="hover:text-emerald-400 transition-colors">Invoicing</Link>
            <Link href="/admin" className="hover:text-emerald-400 transition-colors">Admin</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/customer">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-900/20">Launch App</Button>
            </Link>
          </div>
        </div>
      </header>
      <section className="relative overflow-hidden pt-10 pb-12 px-6 border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1 rounded-full text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" /> AI Inventory & Smart Restock Hub
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white">Sari-Sari Store Inventory Engine</h1>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">Real-time FMCG shelf depletion monitoring, automatic reorder forecasting, and 1-click batch escrow fulfillment on Stellar.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleSimulatePOSSale} className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md">
              <Scan className="w-4 h-4 text-emerald-400" /> Simulate Daily POS Sales Scan
            </button>
          </div>
        </div>
      </section>
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        {lowStockItems.length > 0 && (
          <div className="bg-gradient-to-r from-amber-500/10 via-slate-900/90 to-slate-900 border border-amber-500/30 rounded-3xl p-6 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                <span>{lowStockItems.length} Products Below Critical Reorder Point!</span>
              </div>
              <p className="text-xs text-slate-400 max-w-xl">Depleted staple items will stock out within <strong>48 hours</strong> based on historical store customer foot traffic.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
              <div className="bg-slate-800/80 px-4 py-2.5 rounded-2xl border border-slate-700 text-left sm:text-right">
                <div className="text-[11px] text-slate-400">Total Restock Escrow</div>
                <div className="text-lg font-bold text-emerald-400">₱{totalRestockPhp.toLocaleString()}</div>
                <div className="text-[10px] text-slate-500 font-mono">≈ {totalRestockXlm} XLM</div>
              </div>
              {replenishSuccess ? (
                <div className="bg-emerald-500/20 border border-emerald-500/40 px-5 py-3 rounded-2xl flex items-center gap-2 text-emerald-300 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Escrow Locked & Dispatched!
                </div>
              ) : (
                <Button onClick={handleAutoReplenish} disabled={isReplenishing} className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-2xl shadow-xl shadow-emerald-950/40 flex items-center justify-center gap-2">
                  {isReplenishing ? (<><RefreshCw className="w-4 h-4 animate-spin" /> Locking Escrow on Soroban...</>) : (<><Truck className="w-4 h-4" /> 1-Click Auto-Replenish Escrow</>)}
                </Button>
              )}
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inventory.map((item) => {
            const isLow = item.currentStock <= item.reorderLevel;
            const percent = Math.round((item.currentStock / item.maxCapacity) * 100);
            return (
              <div key={item.id} className={isLow ? 'bg-slate-900/80 border border-amber-500/40 rounded-3xl p-6 shadow-xl relative overflow-hidden transition-all duration-200 flex flex-col justify-between' : 'bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden transition-all duration-200 flex flex-col justify-between'}>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{item.category}</span>
                    {isLow ? (
                      <span className="text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1"><TrendingDown className="w-3 h-3" /> Reorder Needed</span>
                    ) : (
                      <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> In Stock</span>
                    )}
                  </div>
                  <h3 className="font-bold text-white text-base leading-snug">{item.name}</h3>
                  <div className="text-[11px] font-mono text-slate-500 mt-1">SKU: {item.sku}</div>
                  <div className="mt-5 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Current Shelf Stock</span>
                      <span className={isLow ? 'font-bold font-mono text-amber-400' : 'font-bold font-mono text-emerald-400'}>{item.currentStock} / {item.maxCapacity} Units ({percent}%)</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
                      <div className={isLow ? 'h-full rounded-full transition-all duration-500 bg-gradient-to-r from-amber-500 to-orange-500' : 'h-full rounded-full transition-all duration-500 bg-gradient-to-r from-emerald-500 to-teal-400'} style={{ width: percent + '%' }} />
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-800/80 flex justify-between items-center text-xs">
                    <div><div className="text-slate-500 text-[10px]">Wholesale Unit</div><div className="font-bold text-white">₱{item.unitPricePhp.toLocaleString()}</div></div>
                    <div className="text-right"><div className="text-slate-500 text-[10px]">Supplier</div><div className="text-slate-300 font-medium text-[11px] truncate max-w-[120px]">{item.supplier}</div></div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Quick Adjust</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleAdjustStock(item.id, -1)} className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-300 transition-colors" title="Sell 1 unit"><Minus className="w-3.5 h-3.5" /></button>
                    <span className="w-6 text-center font-mono font-bold text-sm text-white">{item.currentStock}</span>
                    <button onClick={() => handleAdjustStock(item.id, 1)} className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-300 transition-colors" title="Restock 1 unit"><Plus className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
