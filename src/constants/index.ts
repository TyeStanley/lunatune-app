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
import { Song } from '@/types/song';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:32786/api';

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

// Playlist type for the library sidebar
export interface Playlist {
  id: string;
  name: string;
  description?: string;
  songs: Song[];
}

// Fake song data
const fakeSongs: Song[] = [
  {
    id: '1',
    title: 'Solas',
    artist: 'Artist One',
    album: 'Single',
    genre: 'Pop',
    filePath: '/music/solas.mp3',
    durationMs: 210000,
    albumArtUrl: '',
    createdAt: new Date().toISOString(),
    isLiked: true,
    likeCount: 123,
  },
  {
    id: '2',
    title: 'Heavy Workout',
    artist: 'Artist Two',
    album: 'Workout Hits',
    genre: 'Electronic',
    filePath: '/music/heavy-workout.mp3',
    durationMs: 180000,
    albumArtUrl: '',
    createdAt: new Date().toISOString(),
    isLiked: false,
    likeCount: 45,
  },
  {
    id: '3',
    title: 'On Repeat',
    artist: 'Artist Three',
    album: 'All Out 2010s',
    genre: 'Pop',
    filePath: '/music/on-repeat.mp3',
    durationMs: 200000,
    albumArtUrl: '',
    createdAt: new Date().toISOString(),
    isLiked: false,
    likeCount: 67,
  },
];

// Fake playlists for the sidebar
export const fakePlaylists: Playlist[] = [
  {
    id: 'p1',
    name: 'Liked Songs',
    description: 'Your favorite tracks',
    songs: [fakeSongs[0]],
  },
  {
    id: 'p2',
    name: 'Heavy Workout',
    description: 'Pump up your energy',
    songs: [fakeSongs[1]],
  },
  {
    id: 'p3',
    name: 'On Repeat',
    description: 'Songs you love to play again and again',
    songs: [fakeSongs[2]],
  },
];
