'use client';

import AuthButton from '@/components/auth/AuthButton';
import { Play, Moon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  if (isLoading || isAuthenticated) {
    return (
      <div className="relative min-h-screen">
        {/* Content */}
        <div className="relative flex min-h-screen items-center justify-center">
          <div className="animate-fadeIn text-center">
            <div className="mb-4">
              <div className="bg-background-lighter border-background-lighter mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-lg border">
                <Moon size={48} className="text-primary animate-pulse" />
              </div>
              <h2 className="mb-2 text-xl font-semibold text-gray-200">Just a moment...</h2>
              <p className="text-gray-400">We&apos;re getting things ready</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen">
      {/* Content */}
      <div className="relative">
        <div className="from-background-lighter/5 pointer-events-none absolute inset-0 bg-gradient-to-b to-transparent" />
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="animate-fadeIn mb-16 text-center">
            <div className="mb-4">
              {/* Logo */}
              <div className="bg-background-lighter border-background-lighter hover:border-primary/50 group mx-auto mb-4 flex h-24 w-24 cursor-pointer items-center justify-center rounded-lg border transition-all duration-300">
                <Moon
                  size={48}
                  className="text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12"
                />
              </div>
              <h1 className="group-hover:text-primary mb-2 text-2xl font-semibold text-gray-200 transition-colors duration-300">
                Music that feels right
              </h1>
              <p className="mb-4 text-gray-400">Your personal soundtrack, curated just for you</p>
              <AuthButton btnText="Log in" />
            </div>
          </div>

          {/* Trending Section (TODO: Hook up to API) */}
          <div className="mb-16">
            <h2 className="mb-6 text-xl font-semibold text-gray-200">TRENDING THIS WEEK</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="group bg-background-lighter/80 border-background-lighter hover:border-primary/50 cursor-pointer rounded-lg border p-4 backdrop-blur-sm transition-all duration-300"
                >
                  <div className="relative">
                    <div className="bg-background-light mb-3 aspect-square w-full overflow-hidden rounded">
                      {/* Placeholder gradient for album art */}
                      <div className="from-primary/20 to-background-lighter absolute inset-0 bg-gradient-to-br" />
                      {/* Play button overlay */}
                      <div className="bg-background-lighter/50 absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <Play size={40} className="text-primary" />
                      </div>
                    </div>
                  </div>
                  <div className="group-hover:text-primary text-gray-200 transition-colors duration-300">
                    Song {item}
                  </div>
                  <div className="text-sm text-gray-400">Artist</div>
                </div>
              ))}
            </div>
          </div>

          {/* Why Music App Section */}
          <div className="mb-16">
            <h2 className="mb-6 text-xl font-semibold text-gray-200">WHY MUSIC APP?</h2>
            <div className="mb-8 space-y-4">
              <div className="flex items-center gap-3 transition-transform duration-300 hover:translate-x-2 hover:transform">
                <span className="text-primary text-2xl">🔍</span>
                <span className="text-gray-200">Discover new music daily</span>
              </div>
              <div className="flex items-center gap-3 transition-transform duration-300 hover:translate-x-2 hover:transform">
                <span className="text-primary text-2xl">⚡</span>
                <span className="text-gray-200">Lightning-fast playback</span>
              </div>
              <div className="flex items-center gap-3 transition-transform duration-300 hover:translate-x-2 hover:transform">
                <span className="text-primary text-2xl">❤️</span>
                <span className="text-gray-200">Save favorites forever</span>
              </div>
            </div>

            {/* Call to action */}
            <div className="text-center">
              <AuthButton
                btnText="Start Listening Now"
                className="bg-primary hover:bg-primary/90 text-background-lighter rounded-lg px-8 py-3 font-semibold transition-colors duration-300"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
