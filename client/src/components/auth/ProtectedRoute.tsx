'use client';

import { useAuth } from '../../hooks/useAuth';
import { useEffect } from 'react';
import { Moon } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, login } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const currentPath = window.location.pathname;
      localStorage.setItem('returnTo', currentPath);
      login();
    }
  }, [isLoading, isAuthenticated, login]);

  if (isLoading) {
    return (
      <div className="bg-background relative min-h-screen">
        {/* Background gradients */}
        <div className="from-background via-background-light/10 to-primary/5 absolute inset-0 bg-gradient-to-br" />
        <div className="from-primary/10 via-background to-background absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]" />

        {/* Content */}
        <div className="relative flex min-h-screen items-center justify-center">
          <div className="animate-fadeIn text-center">
            <div className="mb-4">
              <div className="bg-background-lighter border-background-lighter mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-lg border">
                <Moon size={48} className="text-primary animate-pulse" />
              </div>
              <h2 className="mb-2 text-xl font-semibold text-gray-200">Verifying your access...</h2>
              <p className="text-gray-400">Please wait while we get everything ready</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
