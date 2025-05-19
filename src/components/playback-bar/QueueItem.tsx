'use client';

import { Moon } from 'lucide-react';

interface QueueItemProps {
  title: string;
  artist: string;
}

export default function QueueItem({ title, artist }: QueueItemProps) {
  return (
    <div className="hover:bg-background-lighter/30 flex items-center gap-3 rounded-lg p-2 transition">
      <div className="bg-primary/20 flex h-9 w-9 items-center justify-center rounded">
        <Moon size={20} className="text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-gray-200">{title}</div>
        <div className="truncate text-xs text-gray-400">{artist}</div>
      </div>
    </div>
  );
}
