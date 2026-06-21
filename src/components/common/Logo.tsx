'use client';

import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

export function LogoIcon({ className = '', size = 40, glow = false }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={glow ? { filter: 'drop-shadow(0 0 12px rgba(16, 185, 129, 0.4))' } : {}}
    >
      <defs>
        <linearGradient id="saripay-logo-grad" x1="30" y1="20" x2="170" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="50%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>

      {/* Standalone App Icon Shield Frame */}
      <path
        d="M100 28 L162 44 C162 44 162 82 138 116 C121 140 100 162 100 162 C100 162 79 140 62 116 C38 82 38 44 38 44 L100 28 Z"
        stroke="url(#saripay-logo-grad)"
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Left Interlocking Chain Loop */}
      <path
        d="M65 72 C52 84 52 104 65 116 C76 127 94 127 105 116"
        stroke="url(#saripay-logo-grad)"
        strokeWidth="10"
        strokeLinecap="round"
      />

      {/* Right Interlocking Chain Loop */}
      <path
        d="M135 72 C148 84 148 104 135 116 C124 127 106 127 95 116"
        stroke="url(#saripay-logo-grad)"
        strokeWidth="10"
        strokeLinecap="round"
      />

      {/* Core Heart Shell holding Checkmark */}
      <path
        d="M100 105 C85 86 63 106 100 144 C137 106 115 86 100 105 Z"
        stroke="url(#saripay-logo-grad)"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="#F8FAFC"
      />

      {/* Cryptographic Checkmark (Tick) */}
      <path
        d="M86 118 L96 127 L117 107"
        stroke="url(#saripay-logo-grad)"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LogoLockup({ className = '', size = 40, glow = false }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoIcon size={size} glow={glow} />
      <span className="font-sans font-extrabold text-[#111827] tracking-tight" style={{ fontSize: `${size * 0.55}px` }}>
        Sari<span className="text-[#059669]">Pay</span>
      </span>
    </div>
  );
}
