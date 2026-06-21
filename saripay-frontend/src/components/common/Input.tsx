'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({
  label,
  error,
  className = '',
  id,
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-slate-500 font-sans tracking-wide">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#14B8A6]/20 transition-all font-sans text-sm ${className}`}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-500 font-semibold">{error}</span>
      )}
    </div>
  );
}

