'use client';

import { useEffect } from 'react';
import { useNavigate } from '@/utils/navigation';
import { RouteGuard } from '@/components/auth/RouteGuard';

export default function Page() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/recruiter/dashboard', { replace: true });
  }, [navigate]);

  return (
    <RouteGuard requiredRole="recruiter">
      <div className="min-h-screen bg-[#FAFBF9]" />
    </RouteGuard>
  );
}
