'use client';

import { useAuth } from '@/hooks/useAuth';
import { Music, Clock, Calendar, Zap } from 'lucide-react';
import { dashboardOptions } from '@/constants';
import DashboardOption from '@/components/DashboardOption';
import { useEffect, useState } from 'react';
import { useAppSelector } from '@/redux/hooks';

function getGreeting(): string {
  const hour = new Date().getHours();

  if (hour < 12) {
    return 'Good Morning';
  } else if (hour < 17) {
    return 'Good Afternoon';
  } else if (hour < 21) {
    return 'Good Evening';
  } else {
    return 'Good Night';
  }
}

function getCurrentTime(): string {
  return new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
}

function getCurrentDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export default function Dashboard() {
  const { user } = useAuth();
  const greeting = getGreeting();
  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  const [currentDate, setCurrentDate] = useState(getCurrentDate());
  const { currentSong } = useAppSelector((state) => state.queue);
  const { isPlaying } = useAppSelector((state) => state.playbackControls);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTime());
      setCurrentDate(getCurrentDate());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12">
        <div className="bg-background-lighter/20 rounded-xl border border-white/5 p-6 backdrop-blur-md">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-semibold text-gray-200">
                {greeting}, {user?.name || 'User'}
              </h1>
              <div className="flex items-center gap-4 text-gray-400">
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{currentTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{currentDate}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-background-light/40 rounded-lg border border-white/5 p-3 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <Music
                    size={20}
                    className={`${isPlaying ? 'text-primary animate-pulse' : 'text-primary'}`}
                  />
                  <div>
                    <p className="text-sm text-gray-400">Now Playing</p>
                    {currentSong ? (
                      <div className="flex flex-col">
                        <p className="font-medium text-gray-200">{currentSong.title}</p>
                        <p className="text-sm text-gray-400">{currentSong.artist}</p>
                      </div>
                    ) : (
                      <p className="font-medium text-gray-200">No track selected</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Options */}
      <section className="mb-12">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-200">
          <Zap size={20} className="text-primary" />
          Quick Access
        </h2>
        <div className="bg-background-lighter/20 rounded-lg border border-white/5 p-6 backdrop-blur-md">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {dashboardOptions.map((option) => (
              <DashboardOption
                key={option.text}
                icon={option.icon}
                text={option.text}
                href={option.href}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
