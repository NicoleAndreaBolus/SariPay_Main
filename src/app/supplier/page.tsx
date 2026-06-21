'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SupplierRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard/supplier');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0B1411] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
