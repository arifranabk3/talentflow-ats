'use client';

import React, { Suspense } from 'react';
import { LoginPage } from '@/views/public/LoginPage';
import { Loader2 } from 'lucide-react';

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAFBF9] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-teal-700 animate-spin" />
        </div>
      }
    >
      <LoginPage />
    </Suspense>
  );
}
