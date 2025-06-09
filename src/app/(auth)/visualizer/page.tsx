'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import AudioVisualizer from '@/components/AudioVisualizer';

export default function Visualizer() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12">
        <div className="bg-background-lighter/20 rounded-xl border border-white/5 p-6 backdrop-blur-md">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-semibold text-gray-200">Visualizer</h1>
              <p className="text-gray-400">Audio visualization in real-time</p>
            </div>
            <Link
              href="/dashboard"
              className="bg-primary hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Visualization */}
      <div className="bg-background-lighter/20 rounded-lg border border-white/5 p-6 backdrop-blur-md">
        <AudioVisualizer />
      </div>
    </div>
  );
}
