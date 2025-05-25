'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AppNav from '@/components/nav/AppNav';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <AppNav />
      <div className="pb-20">{children}</div>
    </ProtectedRoute>
  );
}
