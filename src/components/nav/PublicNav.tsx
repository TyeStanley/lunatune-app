'use client';

import AuthButton from '../auth/AuthButton';
import NavLogo from './NavLogo';
import { useTauriCheck } from '@/hooks/useTauriCheck';
import InstallAppButton from './InstallAppButton';

export default function PublicNav() {
  const isDesktop = useTauriCheck();

  return (
    <nav className="border-background-lighter relative border-b">
      <div className="from-background-light/80 via-background/60 to-primary/10 absolute inset-0 z-0 bg-gradient-to-r" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <NavLogo />

          <div className="flex items-center gap-4">
            {!isDesktop && <InstallAppButton />}
            <AuthButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
