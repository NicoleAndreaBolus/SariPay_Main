'use client';

import { useState, useEffect, useCallback } from 'react';
import { Client } from '@/contracts/saripay/src/index';
import { signTransaction } from '@stellar/freighter-api';
import { toStroops } from '@/utils/format';
import { syncWithServer } from '@/utils/sync';

export interface Order {
  id: string;
  supplier: string;
  amount: string;
  status: 'Initialized' | 'Funded' | 'In Transit' | 'Delivered' | 'Canceled';
  date: string;
  details: string;
  merchantAddress?: string;
  merchantName?: string;
}

const DEFAULT_ORDERS: Order[] = [];

function getSanitizedContractId() {
  const rawId = process.env.NEXT_PUBLIC_CONTRACT_ID;
  if (!rawId) return undefined;
  return rawId.trim().replace(/^['"]|['"]$/g, '');
}

export function useSariPayContract() {
  const [orders, setOrders] = useState<Order[]>([]);

  // Load from localStorage or default
  useEffect(() => {
    const saved = localStorage.getItem('saripay_orders');
    if (saved) {
      try {
        setOrders(JSON.parse(saved));
      } catch {
        setOrders(DEFAULT_ORDERS);
      }
    } else {
      setOrders(DEFAULT_ORDERS);
      localStorage.setItem('saripay_orders', JSON.stringify(DEFAULT_ORDERS));
    }
  }, []);

  // Listen and poll localStorage for changes from syncs or other tabs/devices
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('saripay_orders');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setOrders(parsed);
        } catch (e) {
          // ignore
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    const pollInterval = setInterval(handleStorageChange, 2000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(pollInterval);
    };
  }, []);

  const saveOrders = (updated: Order[]) => {
    setOrders(updated);
    localStorage.setItem('saripay_orders', JSON.stringify(updated));
    // Push the changes to the shared server database asynchronously
    syncWithServer().catch(err => console.error("Failed to sync after saveOrders:", err));
  };

  const initOrder = useCallback(async (
    orderData: { id: string; supplier: string; amount: string; details: string; merchantAddress: string; merchantName?: string },
    walletAddress: string | null
  ): Promise<boolean> => {
    const CONTRACT_ID = getSanitizedContractId();

    // Check if we should execute a real Soroban contract call
    if (CONTRACT_ID && walletAddress && !walletAddress.startsWith('GBPASSKEY')) {
      console.log(`[Soroban] Initializing order #${orderData.id} on-chain with contract ID: ${CONTRACT_ID}`);
      
      const client = new Client({
        contractId: CONTRACT_ID,
        rpcUrl: "https://soroban-testnet.stellar.org",
        networkPassphrase: "Test SDF Network ; September 2015",
        publicKey: walletAddress,
        signTransaction: async (txXdr) => {
          const signed = await signTransaction(txXdr, { networkPassphrase: "Test SDF Network ; September 2015" });
          const signedTxXdr = typeof signed === 'string' ? signed : (signed as any).signedTxXdr || signed;
          return { signedTxXdr };
        }
      });

      // Execute on-chain contract method (default testnet stablecoin or native token)
      const tx = await client.init_order({
        order_id: BigInt(orderData.id.replace(/\D/g, '')),
        merchant: orderData.merchantAddress,
        distributor: walletAddress,
        token: "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC", // Testnet native/sac address
        amount: toStroops(orderData.amount)
      });
      
      // Sign & Submit
      const txResult = await tx.signAndSend();
      console.log("[Soroban] Order initialized on ledger:", txResult);

      const newOrder: Order = {
        id: orderData.id,
        supplier: orderData.supplier,
        amount: orderData.amount,
        status: 'Initialized',
        date: new Date().toISOString().split('T')[0],
        details: orderData.details,
        merchantAddress: orderData.merchantAddress,
        merchantName: orderData.merchantName || "Store Merchant"
      };
      
      saveOrders([newOrder, ...orders]);
      return true;
    }

    // Fallback Mock simulation flow
    console.log(`[Mock Simulation] Initializing order #${orderData.id}`);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newOrder: Order = {
      id: orderData.id,
      supplier: orderData.supplier,
      amount: orderData.amount,
      status: 'Initialized',
      date: new Date().toISOString().split('T')[0],
      details: orderData.details,
      merchantAddress: orderData.merchantAddress,
      merchantName: orderData.merchantName || "Store Merchant"
    };

    saveOrders([newOrder, ...orders]);
    return true;
  }, [orders]);

  const fundOrder = useCallback(async (
    id: string, 
    currentBalance: string, 
    walletAddress: string | null
  ): Promise<{ success: boolean, newBalance: string }> => {
    const CONTRACT_ID = getSanitizedContractId();
    
    if (CONTRACT_ID && walletAddress && !walletAddress.startsWith('GBPASSKEY')) {
      console.log(`[Soroban] Funding order #${id} on-chain with contract ID: ${CONTRACT_ID}`);
      
      const client = new Client({
        contractId: CONTRACT_ID,
        rpcUrl: "https://soroban-testnet.stellar.org",
        networkPassphrase: "Test SDF Network ; September 2015",
        publicKey: walletAddress,
        signTransaction: async (txXdr) => {
          const signed = await signTransaction(txXdr, { networkPassphrase: "Test SDF Network ; September 2015" });
          const signedTxXdr = typeof signed === 'string' ? signed : (signed as any).signedTxXdr || signed;
          return { signedTxXdr };
        }
      });

      // Pre-check order status on-chain
      try {
        const checkTx = await client.get_order({
          order_id: BigInt(id.replace(/\D/g, ''))
        });
        const onChainOrder = checkTx.result;
        if (onChainOrder) {
          const chainStatusStr = (onChainOrder.status === 0 ? 'Initialized' :
                                onChainOrder.status === 1 ? 'Funded' :
                                onChainOrder.status === 2 ? 'Delivered' : 'Canceled') as Order['status'];
          
          if (onChainOrder.status !== 0) {
            // Synchronize the local state
            const updated = orders.map(o => o.id === id ? { ...o, status: chainStatusStr } : o);
            saveOrders(updated);
            throw new Error(`This order is already ${chainStatusStr} on the blockchain ledger.`);
          }
        }
      } catch (err: any) {
        if (err.message.includes("blockchain ledger")) {
          throw err;
        }
        console.warn("[Soroban] Status pre-check failed:", err);
      }

      const tx = await client.fund_order({
        order_id: BigInt(id.replace(/\D/g, ''))
      });
      
      const txResult = await tx.signAndSend();
      console.log("[Soroban] Transaction completed on ledger:", txResult);

      const updatedOrders = orders.map(o => 
        o.id === id ? { ...o, status: 'Funded' as const } : o
      );
      saveOrders(updatedOrders);

      return {
        success: true,
        newBalance: currentBalance
      };
    }

    // Fallback Mock simulation flow
    console.log(`[Mock Simulation] Funding order #${id}`);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const orderIndex = orders.findIndex(o => o.id === id);
    if (orderIndex === -1) throw new Error("Order not found.");
    
    const order = orders[orderIndex];
    if (order.status !== 'Initialized') {
      throw new Error("Order is already funded or resolved.");
    }

    const numericBalance = parseFloat(currentBalance);
    const numericAmount = parseFloat(order.amount);
    
    if (numericBalance < numericAmount) {
      throw new Error("Insufficient XLM balance to fund this escrow order.");
    }

    const updatedOrders = orders.map(o => 
      o.id === id ? { ...o, status: 'Funded' as const } : o
    );
    saveOrders(updatedOrders);

    const nextBalance = (numericBalance - numericAmount).toFixed(2);
    return {
      success: true,
      newBalance: nextBalance
    };
  }, [orders]);

  const dispatchOrder = useCallback(async (
    id: string,
    walletAddress: string | null
  ): Promise<boolean> => {
    // Advance status to "In Transit" (Logistics dispatch)
    console.log(`[Dispatch] Advancing order #${id} to In Transit`);
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const updatedOrders = orders.map(o => 
      o.id === id ? { ...o, status: 'In Transit' as const } : o
    );
    saveOrders(updatedOrders);
    return true;
  }, [orders]);

  const confirmDelivery = useCallback(async (
    id: string, 
    walletAddress: string | null
  ): Promise<boolean> => {
    const CONTRACT_ID = getSanitizedContractId();
    
    if (CONTRACT_ID && walletAddress && !walletAddress.startsWith('GBPASSKEY')) {
      console.log(`[Soroban] Releasing escrow for order #${id} on-chain`);
      
      const client = new Client({
        contractId: CONTRACT_ID,
        rpcUrl: "https://soroban-testnet.stellar.org",
        networkPassphrase: "Test SDF Network ; September 2015",
        publicKey: walletAddress,
        signTransaction: async (txXdr) => {
          const signed = await signTransaction(txXdr, { networkPassphrase: "Test SDF Network ; September 2015" });
          const signedTxXdr = typeof signed === 'string' ? signed : (signed as any).signedTxXdr || signed;
          return { signedTxXdr };
        }
      });

      // Pre-check order status on-chain
      try {
        const checkTx = await client.get_order({
          order_id: BigInt(id.replace(/\D/g, ''))
        });
        const onChainOrder = checkTx.result;
        if (onChainOrder) {
          const chainStatusStr = onChainOrder.status === 0 ? 'Initialized' :
                                onChainOrder.status === 1 ? 'Funded' :
                                onChainOrder.status === 2 ? 'Delivered' : 'Canceled';
          
          if (onChainOrder.status === 2) {
            const updated = orders.map(o => o.id === id ? { ...o, status: 'Delivered' as const } : o);
            saveOrders(updated);
            throw new Error("This order has already been marked as Delivered on the blockchain ledger.");
          }
          if (onChainOrder.status === 3) {
            const updated = orders.map(o => o.id === id ? { ...o, status: 'Canceled' as const } : o);
            saveOrders(updated);
            throw new Error("This order is Canceled on the blockchain ledger.");
          }
          if (onChainOrder.status === 0) {
            const updated = orders.map(o => o.id === id ? { ...o, status: 'Initialized' as const } : o);
            saveOrders(updated);
            throw new Error("This order must be funded before delivery can be confirmed.");
          }
        }
      } catch (err: any) {
        if (err.message.includes("blockchain ledger")) {
          throw err;
        }
        console.warn("[Soroban] Status pre-check failed:", err);
      }

      const tx = await client.confirm_delivery({
        order_id: BigInt(id.replace(/\D/g, ''))
      });

      const txResult = await tx.signAndSend();
      console.log("[Soroban] Payout release completed on ledger:", txResult);

      const updatedOrders = orders.map(o => 
        o.id === id ? { ...o, status: 'Delivered' as const } : o
      );
      saveOrders(updatedOrders);
      return true;
    }

    // Fallback Mock simulation flow
    console.log(`[Mock Simulation] Confirming delivery for order #${id}`);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const orderIndex = orders.findIndex(o => o.id === id);
    if (orderIndex === -1) throw new Error("Order not found.");
    
    const order = orders[orderIndex];
    if (order.status !== 'Funded' && order.status !== 'In Transit') {
      throw new Error("Escrow must be funded or in transit before delivery can be confirmed.");
    }

    const updatedOrders = orders.map(o => 
      o.id === id ? { ...o, status: 'Delivered' as const } : o
    );
    saveOrders(updatedOrders);
    return true;
  }, [orders]);

  const getOrder = useCallback(async (
    id: string,
    walletAddress: string | null
  ): Promise<Order | null> => {
    const CONTRACT_ID = getSanitizedContractId();
    if (CONTRACT_ID && walletAddress && !walletAddress.startsWith('GBPASSKEY')) {
      console.log(`[Soroban] Querying order #${id} on-chain with contract ID: ${CONTRACT_ID}`);
      try {
        const client = new Client({
          contractId: CONTRACT_ID,
          rpcUrl: "https://soroban-testnet.stellar.org",
          networkPassphrase: "Test SDF Network ; September 2015",
          publicKey: walletAddress,
          signTransaction: async (txXdr) => {
            const signed = await signTransaction(txXdr, { networkPassphrase: "Test SDF Network ; September 2015" });
            const signedTxXdr = typeof signed === 'string' ? signed : (signed as any).signedTxXdr || signed;
            return { signedTxXdr };
          }
        });

        const tx = await client.get_order({
          order_id: BigInt(id.replace(/\D/g, ''))
        });

        const result = tx.result;
        console.log(`[Soroban] Query result for order #${id}:`, result);

        if (result) {
          // Map to Order interface
          const mappedOrder: Order = {
            id: id,
            supplier: "Santos Distribution", // Default supplier
            amount: (Number(result.amount) / 10000000).toFixed(2), // Stroops to XLM
            status: result.status === 0 ? 'Initialized' :
                    result.status === 1 ? 'Funded' :
                    result.status === 2 ? 'Delivered' : 'Canceled',
            date: new Date().toISOString().split('T')[0],
            details: "On-Chain Escrow Purchase Order",
            merchantAddress: result.merchant,
            merchantName: "Merchant Store"
          };

          // Save to local storage list if not present, or update existing
          const updated = [mappedOrder, ...orders.filter(o => o.id !== id)];
          saveOrders(updated);
          return mappedOrder;
        }
      } catch (err) {
        console.error(`[Soroban] Failed to query order #${id} from contract:`, err);
      }
    }
    return null;
  }, [orders]);

  const syncOrders = useCallback(async (
    walletAddress: string | null
  ): Promise<void> => {
    const CONTRACT_ID = getSanitizedContractId();
    if (!CONTRACT_ID || !walletAddress || walletAddress.startsWith('GBPASSKEY')) return;

    console.log("[Soroban] Syncing active orders with blockchain...");
    
    // Read the latest state from localStorage to prevent closures/stale deps
    const saved = localStorage.getItem('saripay_orders');
    const currentOrders: Order[] = saved ? JSON.parse(saved) : DEFAULT_ORDERS;

    try {
      const client = new Client({
        contractId: CONTRACT_ID,
        rpcUrl: "https://soroban-testnet.stellar.org",
        networkPassphrase: "Test SDF Network ; September 2015",
        publicKey: walletAddress,
        signTransaction: async (txXdr) => {
          const signed = await signTransaction(txXdr, { networkPassphrase: "Test SDF Network ; September 2015" });
          const signedTxXdr = typeof signed === 'string' ? signed : (signed as any).signedTxXdr || signed;
          return { signedTxXdr };
        }
      });

      let changed = false;
      const updatedOrders = await Promise.all(currentOrders.map(async (order) => {
        // Only sync orders that aren't finalized locally
        if (order.status === 'Delivered' || order.status === 'Canceled') {
          return order;
        }

        try {
          const tx = await client.get_order({
            order_id: BigInt(order.id.replace(/\D/g, ''))
          });
          const result = tx.result;
          
          if (result) {
            const chainStatusNum = result.status;
            let targetStatus: Order['status'] = order.status;
            
            if (chainStatusNum === 0) {
              targetStatus = 'Initialized';
            } else if (chainStatusNum === 1) {
              // On-chain is funded. Local could be "Initialized" (need to update to Funded)
              // or "In Transit" (should keep "In Transit" since it is funded on-chain but cargo is shipped locally)
              if (order.status === 'Initialized') {
                targetStatus = 'Funded';
              }
            } else if (chainStatusNum === 2) {
              targetStatus = 'Delivered';
            } else if (chainStatusNum === 3) {
              targetStatus = 'Canceled';
            }
            
            if (order.status !== targetStatus) {
              changed = true;
              console.log(`[Soroban] Order #${order.id} status changed from ${order.status} to ${targetStatus}`);
              return {
                ...order,
                status: targetStatus,
                amount: (Number(result.amount) / 10000000).toFixed(2)
              };
            }
          }
        } catch (e) {
          console.error(`[Soroban] Failed to sync order #${order.id}:`, e);
        }
        return order;
      }));

      if (changed) {
        saveOrders(updatedOrders);
      }
    } catch (err) {
      console.error("[Soroban] Error syncing orders with blockchain:", err);
    }
  }, []);

  const resetMockData = useCallback(() => {
    saveOrders(DEFAULT_ORDERS);
  }, []);

  return {
    orders,
    initOrder,
    fundOrder,
    dispatchOrder,
    confirmDelivery,
    getOrder,
    syncOrders,
    resetMockData,
  };
}
