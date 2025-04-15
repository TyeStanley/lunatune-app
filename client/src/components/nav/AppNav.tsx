'use client';

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import AuthButton from '../auth/AuthButton';
import NavLogo from './NavLogo';
import { useTauriCheck } from '@/hooks/useTauriCheck';
import InstallAppButton from './InstallAppButton';

export default function AppNav() {
  const isDesktop = useTauriCheck();
  const router = useRouter();

  const handleSearchFocus = () => {
    router.push('/search');
  };

  return (
    <nav className="bg-background-light border-background-lighter border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-8">
          <div className="flex items-center gap-8">
            <NavLogo />

            {/* Search Bar */}
            <div className="bg-background-lighter hidden items-center gap-3 rounded-lg px-4 py-2 sm:flex">
              <Search className="text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search songs, artists, albums"
                onFocus={handleSearchFocus}
                className="bg-background-lighter w-64 text-gray-200 placeholder-gray-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <AuthButton btnText="Log out" />
            {!isDesktop && <InstallAppButton />}
          </div>
        </div>
      </div>
    </nav>
  );
}
