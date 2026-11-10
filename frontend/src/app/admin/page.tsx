'use client';

import { useEffect } from 'react';
import { useNavigate } from '@/utils/navigation';
import { RouteGuard } from '@/components/auth/RouteGuard';

export default function Page() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/admin/dashboard', { replace: true });
  }, [navigate]);

  return (
    <RouteGuard requiredRole="admin">
      <div className="min-h-screen bg-[#FAFBF9]" />
    </RouteGuard>
  );
}

