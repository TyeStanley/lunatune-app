'use client';

import { useAuth } from '@/hooks/useAuth';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold text-gray-200">
        Welcome back, {user?.name || 'User'}
      </h1>
      <div className="bg-background-lighter rounded-lg p-6">
        <h2 className="mb-4 text-xl text-gray-200">Your Dashboard</h2>
        {/* Add your dashboard content here */}
      </div>
    </div>
  );
}
