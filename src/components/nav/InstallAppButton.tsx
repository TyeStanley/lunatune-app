'use client';

import { Download } from 'lucide-react';

export default function InstallAppButton() {
  return (
    <a
      href="/installer/music-player.exe"
      download="music-player-installer.exe"
      // ! TODO: REPLACE HIDDEN WITH FLEX WHEN NEW FILE IS READY
      className="bg-background-lighter hover:bg-primary/20 hidden cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-sm text-gray-200 transition-colors"
    >
      <Download size={16} />
      Install App
    </a>
  );
}
