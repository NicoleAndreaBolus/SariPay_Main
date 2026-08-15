'use client';

import React, { useState } from 'react';
import { 
  ShoppingBag, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  CheckCircle2, 
  Truck, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  PackageCheck
} from 'lucide-react';
import { Button } from '@/components/common/Button';
import confetti from 'canvas-confetti';

interface RestockItem {
  id: string;
  name: string;
  category: 'Staples & Grains' | 'Beverages & Coffee' | 'Canned & Instant' | 'Household';
  unit: string;
  pricePhp: number;
  priceXlm: number;
  imageIcon: string;
  minOrder: number;
}

const WHOLESALE_CATALOG: RestockItem[] = [
  {
    id: 'prod-1',
    name: 'Sinandomeng Special Rice (25kg Sack)',
    category: 'Staples & Grains',
    unit: '1 sack (25kg)',
    pricePhp: 1250,
    priceXlm: 22.12,
    imageIcon: '🌾',
    minOrder: 1
  },
  {
    id: 'prod-2',
    name: 'Great Taste White Coffee (10x 30-Pack Box)',
    category: 'Beverages & Coffee',
    unit: '1 wholesale box',
    pricePhp: 1850,
    priceXlm: 32.74,
    imageIcon: '☕',
    minOrder: 1
  },
  {
    id: 'prod-3',
    name: 'Lucky Me Pancit Canton Kalamansi (Box of 72)',
    category: 'Canned & Instant',
    unit: '1 master carton',
    pricePhp: 1150,
    priceXlm: 20.35,
    imageIcon: '🍜',
    minOrder: 1
  },
  {
    id: 'prod-4',
    name: '555 Sardines in Tomato Sauce (Box of 50 Cans)',
    category: 'Canned & Instant',
    unit: '1 box (50 cans)',
    pricePhp: 1350,
    priceXlm: 23.89,
    imageIcon: '🥫',
    minOrder: 1
  },
  {
    id: 'prod-5',
    name: 'Bear Brand Fortified Milk Powder 300g (Case of 24)',
    category: 'Beverages & Coffee',
    unit: '1 case (24 pouches)',
    pricePhp: 2400,
    priceXlm: 42.48,
    imageIcon: '🥛',
    minOrder: 1
  },
  {
    id: 'prod-6',
    name: 'Datu Puti Soy Sauce & Vinegar Twin Pack (12 Gallons)',
    category: 'Staples & Grains',
    unit: '1 bundle (12 gals)',
    pricePhp: 1650,
    priceXlm: 29.20,
    imageIcon: '🍶',
    minOrder: 1
  },
  {
    id: 'prod-7',
    name: 'San Miguel Pale Pilsen 330ml (4 Cases x 24 Bottles)',
    category: 'Beverages & Coffee',
    unit: '4 crates',
    pricePhp: 3800,
    priceXlm: 67.26,
    imageIcon: '🍺',
    minOrder: 1
  },
  {
    id: 'prod-8',
    name: 'Safeguard White Soap Bar 135g (Box of 36)',
    category: 'Household',
    unit: '1 box (36 bars)',
    pricePhp: 1550,
    priceXlm: 27.43,
    imageIcon: '🧼',
    minOrder: 1
  }
];

const SUPPLIERS = [
  'Universal Robina Wholesale Hub',
  'Monde Nissin Distribution Manila',
  'San Miguel Beverage Depot',
  'Nestle Philippines B2B Logistics',
  'Century Pacific Wholesale Direct'
];

interface RestockCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlaceOrder: (orderData: {
    supplier: string;
    details: string;
    amountXlm: string;
    amountPhp: number;
  }) => void;
  merchantName?: string;
}

export default function RestockCatalogModal({
  isOpen,
  onClose,
  onPlaceOrder,
  merchantName = "My Sari-Sari Store"
}: RestockCatalogModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSupplier, setSelectedSupplier] = useState<string>(SUPPLIERS[0]);
  const [cart, setCart] = useState<{ [id: string]: number }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  if (!isOpen) return null;

  const categories = ['All', 'Staples & Grains', 'Beverages & Coffee', 'Canned & Instant', 'Household'];

  const filteredCatalog = selectedCategory === 'All'
    ? WHOLESALE_CATALOG
    : WHOLESALE_CATALOG.filter(item => item.category === selectedCategory);

  const handleQuantityChange = (id: string, delta: number) => {
    setCart(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: next };
    });
  };

  const totalItemsCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  const totalPhp = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = WHOLESALE_CATALOG.find(p => p.id === id);
    return sum + (item ? item.pricePhp * qty : 0);
  }, 0);

  const totalXlm = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = WHOLESALE_CATALOG.find(p => p.id === id);
    return sum + (item ? item.priceXlm * qty : 0);
  }, 0);

  const handleCheckout = () => {
    if (totalItemsCount === 0) return;
    setIsSubmitting(true);

    const itemsSummary = Object.entries(cart)
      .map(([id, qty]) => {
        const item = WHOLESALE_CATALOG.find(p => p.id === id);
        return `${qty}x ${item?.name.split(' (')[0]}`;
      })
      .join(', ');

    setTimeout(() => {
      onPlaceOrder({
        supplier: selectedSupplier,
        details: itemsSummary,
        amountXlm: totalXlm.toFixed(2),
        amountPhp: totalPhp
      });

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      setOrderSuccess(true);
      setIsSubmitting(false);

      setTimeout(() => {
        setOrderSuccess(false);
        setCart({});
        onClose();
      }, 1800);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-up">
        
        {/* Header */}
        <div className="px-6 py-4.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900">Wholesale FMCG Restock Catalog</h3>
                <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wide">
                  0% Escrow Fee
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Select fast-moving store inventory and lock payment in smart escrow.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {orderSuccess ? (
          <div className="p-12 flex flex-col items-center justify-center text-center my-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 animate-bounce">
              <PackageCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Restock Order Placed & Escrow Created!</h3>
            <p className="text-xs text-slate-600 max-w-md">
              Your wholesale invoice for <span className="font-bold text-emerald-600">₱{totalPhp.toLocaleString()} ({totalXlm.toFixed(2)} XLM)</span> has been locked in smart contract escrow. {selectedSupplier} has been notified for warehouse dispatch!
            </p>
          </div>
        ) : (
          <>
            {/* Controls: Supplier Select & Category Pills */}
            <div className="p-6 pb-2 border-b border-slate-100 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs font-bold text-slate-700 whitespace-nowrap">Supplier:</span>
                  <select
                    value={selectedSupplier}
                    onChange={(e) => setSelectedSupplier(e.target.value)}
                    className="text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 w-full sm:w-72"
                  >
                    {SUPPLIERS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="flex bg-slate-100 p-1 rounded-xl gap-1 overflow-x-auto w-full sm:w-auto">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                        selectedCategory === cat 
                          ? 'bg-white text-slate-900 shadow-sm' 
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Catalog Grid (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredCatalog.map(item => {
                const qty = cart[item.id] || 0;
                return (
                  <div 
                    key={item.id} 
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                      qty > 0 
                        ? 'border-emerald-500/50 bg-emerald-50/20 shadow-sm' 
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl shrink-0">
                        {item.imageIcon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{item.category}</span>
                        <h4 className="text-xs font-bold text-slate-900 leading-tight mt-0.5">{item.name}</h4>
                        <span className="text-[11px] text-slate-500 block mt-1">Package: {item.unit}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-sm font-extrabold text-slate-900">₱{item.pricePhp.toLocaleString()}</span>
                        <span className="text-[10px] font-mono text-emerald-600 block">{item.priceXlm} XLM</span>
                      </div>

                      {qty === 0 ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, 1)}
                          className="text-xs font-bold py-1 px-3 border border-slate-200 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300"
                        >
                          <Plus className="w-3.5 h-3.5 mr-1" /> Add
                        </Button>
                      ) : (
                        <div className="flex items-center gap-2 bg-white border border-emerald-200 p-1 rounded-xl shadow-xs">
                          <button
                            onClick={() => handleQuantityChange(item.id, -1)}
                            className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 font-bold"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-extrabold text-slate-900 w-6 text-center">{qty}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, 1)}
                            className="w-6 h-6 rounded-lg bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center text-white font-bold"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Checkout Bar */}
            <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <span>Delivery to: <strong className="text-slate-900">{merchantName}</strong></span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Order Value</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-black text-slate-950">₱{totalPhp.toLocaleString()}</span>
                    <span className="text-xs font-mono font-extrabold text-emerald-600">({totalXlm.toFixed(2)} XLM)</span>
                  </div>
                </div>

                <Button
                  variant="primary"
                  disabled={totalItemsCount === 0 || isSubmitting}
                  onClick={handleCheckout}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold px-6 py-3 rounded-2xl shadow-md shadow-emerald-900/10 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    'Locking Escrow...'
                  ) : (
                    <>
                      Place & Lock Escrow <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
