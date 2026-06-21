'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Database, CheckCircle2 } from 'lucide-react';
import { LogoLockup } from './Logo';

export function Footer() {
  const pathname = usePathname();
  if (
    pathname?.startsWith('/dashboard') || 
    pathname?.startsWith('/admin') || 
    pathname?.startsWith('/order')
  ) {
    return null;
  }

  const columns = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '#features' },
        { label: 'Security', href: '#security' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Documentation', href: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Contact', href: '#' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Blog', href: '#' },
        { label: 'Help Center', href: '#' },
        { label: 'API', href: '#' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Service', href: '#' },
      ],
    },
  ];

  return (
    <footer className="bg-[#FAFAF9] border-t border-[#E5E7EB] text-[#6B7280]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        
        {/* Top: Logo & Multi-column Links */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 md:gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="col-span-2 flex flex-col gap-5">
            <Link href="/" className="inline-flex">
              <LogoLockup size={34} />
            </Link>
            <p className="text-sm text-[#6B7280] max-w-sm leading-relaxed">
              SariPay is a Web3-powered B2B escrow and logistics verification platform securing payments for wholesale merchants and distributors.
            </p>
            {/* Social Icons */}
            <div className="flex gap-4 text-[#6B7280]">
              {/* Twitter / X SVG */}
              <a href="#" aria-label="Twitter" className="hover:text-[#059669] transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                </svg>
              </a>
              {/* LinkedIn SVG */}
              <a href="#" aria-label="LinkedIn" className="hover:text-[#059669] transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect width="4" height="12" x="2" y="9"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
              {/* GitHub SVG */}
              <a href="#" aria-label="GitHub" className="hover:text-[#059669] transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
                  <path d="M9 18c-4.51 2-5-2-7-2"/>
                </svg>
              </a>
              {/* Facebook SVG */}
              <a href="#" aria-label="Facebook" className="hover:text-[#059669] transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Links Columns */}
          {columns.map((column) => (
            <div key={column.title} className="flex flex-col gap-4 col-span-1">
              <h4 className="text-xs font-semibold text-[#111827] uppercase tracking-wider">
                {column.title}
              </h4>
              <ul className="flex flex-col gap-2.5 text-sm">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="hover:text-[#111827] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Bottom Banner with Tech Info & Copyright */}
        <div className="border-t border-[#E5E7EB] pt-8 flex flex-col sm:flex-row justify-between items-center gap-6 text-[11px] font-medium text-[#6B7280]">
          
          {/* Tech Badges */}
          <div className="flex flex-wrap justify-center gap-6">
            <span className="flex items-center gap-1.5 font-mono text-[10px]">
              <ShieldCheck className="w-4 h-4 text-[#059669]" />
              PASSKEY SECURED
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[10px]">
              <Database className="w-4 h-4 text-[#059669]" />
              STELLAR BLOCKCHAIN
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[10px]">
              <CheckCircle2 className="w-4 h-4 text-[#059669]" />
              SMART CONTRACT SETTLED
            </span>
          </div>

          {/* Copyright */}
          <p className="font-sans">
            &copy; {new Date().getFullYear()} SariPay. All rights reserved. Built for retail supply chain trust.
          </p>

        </div>

      </div>
    </footer>
  );
}
