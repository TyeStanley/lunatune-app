'use client';

import { useAuth } from '@/hooks/useAuth';

export default function AuthButton() {
  const { isAuthenticated, isLoading, login, signOut, user } = useAuth();

  if (isLoading) {
    return (
      <button className="cursor-not-allowed rounded-md px-4 py-2 text-gray-400" disabled>
        Loading...
      </button>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-400">{user.name || user.email}</span>
        <button
          className="bg-background-lighter hover:bg-primary/20 inline-flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-sm text-gray-200 transition-colors"
          onClick={() => signOut()}
        >
          Log out
        </button>
      </div>
    );
  }

  return (
    <button
      className="bg-background-lighter hover:bg-primary/20 inline-flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-sm text-gray-200 transition-colors"
      onClick={() => login()}
    >
      Log in
    </button>
  );
}
