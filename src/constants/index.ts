import {
  ListMusic,
  Heart,
  Library,
  Search,
  History,
  Sparkles,
  TrendingUp,
  Timer,
} from 'lucide-react';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export { baseUrl };

// /src/app/(auth)/dashboard/page.tsx - Dashboard Options
export const dashboardOptions = [
  {
    icon: Search,
    text: 'Search Music',
    href: '/search',
  },
  {
    icon: Heart,
    text: 'Liked Songs',
    href: '/liked',
  },
  {
    icon: Library,
    text: 'My Library',
    href: '/library',
  },
  {
    icon: ListMusic,
    text: 'Explore Playlists',
    href: '/playlists',
  },
  {
    icon: History,
    text: 'Recently Played',
    href: '/recent',
  },
  {
    icon: Sparkles,
    text: 'Visualizer',
    href: '/visualizer',
  },
  {
    icon: TrendingUp,
    text: 'Popular Songs',
    href: '/popular',
  },
  {
    icon: Timer,
    text: 'Sleep Timer',
    href: '/sleep-timer',
  },
];
