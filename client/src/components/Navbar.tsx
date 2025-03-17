'use client';

import { Download } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-background-light border-background-lighter border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-end">
          <div className="flex items-center">
            <button
              className="bg-background-lighter hover:bg-primary/20 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm text-gray-200 transition-colors"
              onClick={() => {
                // TODO: Add download functionality
                console.log('Download app clicked');
              }}
            >
              <Download size={16} />
              <span>Install App</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
