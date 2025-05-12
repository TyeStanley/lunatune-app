'use client';

import { useAuth } from '@/hooks/useAuth';
import { DropdownMenu } from '../ui/DropdownMenu';
import { useRouter } from 'next/navigation';

export default function AuthButton({
  btnText,
  className,
}: {
  btnText?: string;
  className?: string;
}) {
  const { isAuthenticated, isLoading, login, signOut, user } = useAuth();
  const router = useRouter();

  const dropdownMenuItems = [
    {
      label: 'Dashboard',
      onClick: () => router.push('/dashboard'),
    },
    {
      label: 'Find Songs',
      onClick: () => router.push('/search'),
    },
    {
      label: 'Log out',
      onClick: signOut,
    },
  ];

  if (isLoading) {
    return (
      <button className="cursor-not-allowed rounded-md px-4 py-2 text-gray-400" disabled>
        Loading...
      </button>
    );
  }

  if (isAuthenticated && user) {
    return (
      <DropdownMenu
        trigger={
          <div className="bg-background-lighter hover:bg-primary/20 inline-flex cursor-pointer items-center rounded-md px-4 py-2 text-sm text-gray-200 transition-colors">
            {user.name || 'Account'}
          </div>
        }
        items={dropdownMenuItems}
      />
    );
  }

  return (
    <button
      className={`bg-background-lighter hover:bg-primary/20 inline-flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-sm text-gray-200 transition-colors ${className}`}
      onClick={() => login()}
    >
      {btnText || 'Log in'}
    </button>
  );
}
