'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, X, Wallet, ArrowRight } from 'lucide-react';
import { useStellarWallet } from '@/hooks/useStellarWallet';
import { Button } from './Button';
import { shortenAddress } from '@/utils/address';
import { LogoLockup } from './Logo';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { walletAddress, authType } = useStellarWallet();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll Listener Hook for dynamic styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hide on dashboard, admin, and order pages
  if (
    pathname?.startsWith('/dashboard') || 
    pathname?.startsWith('/admin') || 
    pathname?.startsWith('/order')
  ) {
    return null;
  }

  const handleLaunchDashboard = () => {
    if (walletAddress) {
      const role = localStorage.getItem('saripay_auth_role') || 'merchant';
      router.push(role === 'supplier' ? '/dashboard/supplier' : '/dashboard/customer');
    } else {
      router.push('/login');
    }
  };

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Solutions', href: '#solutions' },
    { label: 'Security', href: '#security' },
    { label: 'Pricing', href: '#pricing' },
  ];

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'backdrop-blur-md bg-[#FAFAF9]/80 border-b border-[#E5E7EB] shadow-sm' 
        : 'bg-[#FAFAF9] border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Left Section: Brand Asset Identity */}
        <Link href="/" className="flex items-center gap-2 group">
          <LogoLockup size={38} className="group-hover:scale-102 transition-transform duration-300" />
        </Link>

        {/* Center Section: Primary Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-[14px] font-medium text-[#6B7280]">
          {navLinks.map((link) => (
            <Link 
              key={link.label} 
              href={link.href} 
              className="hover:text-[#111827] transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-[#059669] hover:after:w-full after:transition-all after:duration-300"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Section: Contextual CTA */}
        <div className="hidden md:flex items-center gap-3">
          {walletAddress ? (
            <div className="flex items-center gap-3">
              {/* Connected State Address Tag */}
              <div className="bg-white border border-[#E5E7EB] px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                <span className="text-xs font-mono font-bold text-[#111827]">
                  {shortenAddress(walletAddress, 5)}
                </span>
                <span className="text-[10px] bg-[#059669]/10 text-[#059669] font-semibold px-2 py-0.5 rounded-full border border-[#059669]/20 uppercase font-mono">
                  {authType}
                </span>
              </div>
              
              {/* Quick dashboard launch */}
              <Button
                variant="primary"
                size="sm"
                onClick={handleLaunchDashboard}
                className="flex items-center gap-1 bg-[#059669] text-white font-bold"
              >
                Dashboard <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={handleLaunchDashboard}
                className="text-[#6B7280] hover:text-[#111827] font-semibold"
              >
                Get Started
              </Button>
              <Button
                variant="primary"
                onClick={() => router.push('/login')}
                className="flex items-center gap-2 font-bold bg-[#059669] hover:bg-[#10B981] text-white px-5 py-2 rounded-xl transition-all duration-200"
              >
                Request Demo
              </Button>
            </>
          )}
        </div>

        {/* Mobile Hamburger toggle button */}
        <div className="flex md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-[#6B7280] hover:text-[#111827] focus:outline-none p-2 rounded-lg hover:bg-stone-100 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Overlay panel */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-[#FAFAF9] border-b border-[#E5E7EB] backdrop-blur-md transition-all duration-300 p-6 flex flex-col gap-4 shadow-lg animate-in slide-in-from-top-4">
          <div className="flex flex-col gap-3 font-semibold text-[#6B7280]">
            {navLinks.map((link) => (
              <Link 
                key={link.label} 
                href={link.href} 
                onClick={() => setIsOpen(false)} 
                className="hover:text-[#111827] transition-colors py-2 border-b border-[#E5E7EB]/50"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-4 flex flex-col gap-3">
            {walletAddress ? (
              <>
                <div className="bg-white border border-[#E5E7EB] px-4 py-3 rounded-xl flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                    <span className="text-xs font-mono font-bold text-[#111827]">
                      {shortenAddress(walletAddress, 6)}
                    </span>
                  </div>
                  <span className="text-[10px] bg-[#059669]/10 text-[#059669] font-semibold px-2.5 py-0.5 rounded-full border border-[#059669]/20 uppercase font-mono">
                    {authType}
                  </span>
                </div>
                
                <Button
                  onClick={handleLaunchDashboard}
                  className="w-full flex items-center justify-center gap-2"
                >
                  Go to Dashboard <ArrowRight className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Button
                  variant="secondary"
                  onClick={handleLaunchDashboard}
                  className="w-full flex items-center justify-center gap-2"
                >
                  Get Started
                </Button>
                <Button
                  variant="primary"
                  onClick={() => router.push('/login')}
                  className="w-full flex items-center justify-center gap-2"
                >
                  Request Demo
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
