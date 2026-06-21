'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Lock, 
  MapPin, 
  QrCode, 
  Terminal, 
  ChevronRight, 
  Sparkles, 
  Play, 
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/common/Button';

export default function HowItWorks() {
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "// Click 'Run Simulation' to execute Soroban transaction..."
  ]);
  const [isSimulating, setIsSimulating] = useState(false);

  const steps = [
    {
      num: "01",
      title: "Order Initiation",
      desc: "The supplier registers inventory details and dispatches a digital invoice directly to the merchant's dashboard feed.",
      details: "Calls Soroban contract: init_order()",
      icon: FileText,
    },
    {
      num: "02",
      title: "Escrow Capital Lock",
      desc: "The merchant locks the corresponding token value (XLM/USDC) into the isolated smart contract escrow using a biometric Passkey.",
      details: "Calls Soroban contract: fund_order()",
      icon: Lock,
    },
    {
      num: "03",
      title: "Local Logistics Verification",
      desc: "Wholesale goods are delivered physical to the local merchant shop hub located in Pampanga.",
      details: "Status transitions: In Transit",
      icon: MapPin,
    },
    {
      num: "04",
      title: "QR Resolution Payout",
      desc: "The merchant confirms the delivery by presenting their handoff QR code, immediately releasing the escrow funds on-chain.",
      details: "Calls Soroban contract: confirm_delivery()",
      icon: QrCode,
    },
  ];

  const handleRunSimulation = async () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setTerminalLogs([]);

    const logList = [
      "Connecting to Stellar Testnet Horizon RPC...",
      "Contract Client initialized. Address: CACS...RPAY",
      "Calling init_order({ order_id: 10526, amount: 25.00 XLM })...",
      "Invoice registered on ledger. Height: #104,281",
      "Waiting for merchant escrow funding...",
      "Calling fund_order({ order_id: 10526 }) via Freighter Wallet...",
      "Ledger confirmed: 25.00 XLM locked in escrow. State: Funded",
      "Supplier dispatches shipment cargo to Pampanga Hub...",
      "Merchant scans delivery QR code: confirm_delivery({ order_id: 10526 })...",
      "Proof matches cryptographic check. Transferring funds...",
      "On-chain transfer successful. 25.00 XLM paid to supplier.",
      "✓ Lifecycle Completed. Escrow settled successfully."
    ];

    for (let i = 0; i < logList.length; i++) {
      setTerminalLogs(prev => [...prev, logList[i]]);
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    setIsSimulating(false);
  };

  const rustCode = `#[contractimpl]
impl SariPayEscrow {
    pub fn init_order(
        env: Env, 
        order_id: u64, 
        merchant: Address, 
        distributor: Address, 
        amount: i128
    ) {
        let key = DataKey::Order(order_id);
        let order = SupplyOrder {
            merchant,
            distributor,
            amount,
            status: OrderStatus::Initialized,
        };
        env.storage().persistent().set(&key, &order);
    }

    pub fn fund_order(env: Env, order_id: u64) {
        let key = DataKey::Order(order_id);
        let mut order: SupplyOrder = env.storage().persistent().get(&key).unwrap();
        order.token.transfer(&order.merchant, &env.current_contract_address(), &order.amount);
        order.status = OrderStatus::Funded;
        env.storage().persistent().set(&key, &order);
    }
}`;

  return (
    <main className="min-h-screen bg-gradient-to-tr from-[#0B1411] via-[#12221D] to-[#0B1411] text-[#F3F4F6] py-16 px-6 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto flex flex-col gap-12 relative z-10">
        
        {/* Page Title */}
        <header className="text-center">
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Core Infrastructure Flow
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            How Escrow Logistics Operates
          </h1>
          <p className="text-xs text-gray-400 mt-2 max-w-xl mx-auto leading-relaxed">
            SariPay replaces cash collections with a secure cryptographic handoff pipeline. Here is the step-by-step transaction flow.
          </p>
        </header>

        {/* 1. Interactive Lifecycle Stepper */}
        <section className="bg-[#12221D] rounded-3xl p-6 md:p-8 border border-[#1A312A] shadow-xl">
          <h2 className="text-lg font-bold text-white tracking-tight mb-8 border-b border-[#1A312A] pb-4">
            Order Fulfillment Lifecycle Stepper
          </h2>

          <div className="relative border-l border-[#1A312A] ml-4 md:ml-6 pl-6 md:pl-8 flex flex-col gap-10">
            {steps.map((step, idx) => {
              const StepIcon = step.icon;
              return (
                <div key={step.num} className="relative group">
                  
                  {/* Step Number Dot indicator */}
                  <div className="absolute -left-12.5 md:-left-14.5 top-0 w-8 h-8 rounded-lg bg-[#0B1411] border border-[#1A312A] group-hover:border-emerald-500 flex items-center justify-center text-xs font-mono font-bold text-emerald-400 group-hover:text-white transition-colors duration-300">
                    {step.num}
                  </div>

                  <div className="bg-[#0B1411]/50 p-5 rounded-2xl border border-emerald-950/30 hover:border-emerald-500/10 transition-all duration-300 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <div>
                      <h3 className="font-bold text-white flex items-center gap-2 text-sm md:text-base">
                        <StepIcon className="w-4.5 h-4.5 text-emerald-400" />
                        {step.title}
                      </h3>
                      <p className="text-xs text-gray-400 mt-2 leading-relaxed max-w-xl">{step.desc}</p>
                    </div>
                    <span className="text-[10px] font-mono bg-emerald-500/5 text-emerald-400/80 border border-emerald-500/15 px-2.5 py-1 rounded-full whitespace-nowrap self-end sm:self-auto font-bold uppercase tracking-wider">
                      {step.details}
                    </span>
                  </div>

                </div>
              );
            })}
          </div>
        </section>

        {/* 2. Live Code Snippet Sandbox */}
        <section className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Ledger Simulation Sandbox</h2>
              <p className="text-xs text-gray-500 mt-1">Interact with our simulated Soroban contract logic sandbox.</p>
            </div>
            <Button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="flex items-center gap-2 self-stretch sm:self-auto justify-center bg-emerald-500 text-[#0B1411]"
            >
              <Play className="w-4 h-4 text-[#0B1411]" />
              {isSimulating ? 'Processing Log...' : 'Run Simulation'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            
            {/* Rust smart contract snippet */}
            <div className="bg-[#12221D] rounded-3xl border border-[#1A312A] shadow-xl overflow-hidden flex flex-col">
              <div className="bg-[#0B1411]/60 px-5 py-3.5 border-b border-[#1A312A] flex justify-between items-center">
                <span className="text-xs font-mono font-bold text-gray-400">escrow_contract.rs (Soroban)</span>
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
              </div>
              <div className="p-5 font-mono text-[10.5px] leading-relaxed text-gray-400 overflow-x-auto whitespace-pre bg-[#0B1411]/30 flex-grow">
                {rustCode}
              </div>
            </div>

            {/* Terminal log window */}
            <div className="bg-[#12221D] rounded-3xl border border-[#1A312A] shadow-xl overflow-hidden flex flex-col min-h-[300px]">
              <div className="bg-[#0B1411]/60 px-5 py-3.5 border-b border-[#1A312A] flex justify-between items-center">
                <span className="text-xs font-mono font-bold text-gray-400 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" /> Output Sandbox
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="p-5 font-mono text-[11px] leading-normal text-gray-400 overflow-y-auto bg-[#0B1411]/50 flex-grow flex flex-col gap-2 select-text">
                {terminalLogs.map((log, idx) => (
                  <div key={idx} className={log.startsWith('✓') ? 'text-emerald-400 font-bold' : log.includes('Calling') ? 'text-blue-400' : 'text-gray-400'}>
                    {log}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

      </div>
    </main>
  );
}
