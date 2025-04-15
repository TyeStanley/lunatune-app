'use client';

import { Download } from 'lucide-react';
import AuthButton from '../auth/AuthButton';
import NavLogo from './NavLogo';
import { useTauriCheck } from '@/hooks/useTauriCheck';

export default function PublicNav() {
  const isDesktop = useTauriCheck();

  return (
    <nav className="bg-background-light border-background-lighter border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <NavLogo />

          <div className="flex items-center gap-4">
            <AuthButton btnText="Log in" />
            {!isDesktop && (
              <a
                href="/installer/music-player.exe"
                download="music-player-installer.exe"
                className="bg-background-lighter hover:bg-primary/20 inline-flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-sm text-gray-200 transition-colors"
              >
                <Download size={16} />
                <span>Install App</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
