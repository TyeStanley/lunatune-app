'use client';

import AuthButton from '../auth/AuthButton';
import NavLogo from './NavLogo';
import { useTauriCheck } from '@/hooks/useTauriCheck';
import InstallAppButton from './InstallAppButton';

export default function PublicNav() {
  const isDesktop = useTauriCheck();

  return (
    <nav className="bg-background-light border-background-lighter border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <NavLogo />

          <div className="flex items-center gap-4">
            <AuthButton btnText="Log in" />
            {!isDesktop && <InstallAppButton />}
          </div>
        </div>
      </div>
    </nav>
  );
}
