'use client';

import { useRef } from 'react';

interface SliderProps {
  value: number;
  max: number;
  onChange: (value: number) => void;
  formatLabel?: (value: number) => string;
  showLabels?: boolean;
}

export default function Slider({
  value,
  max,
  onChange,
  formatLabel,
  showLabels = false,
}: SliderProps) {
  const progressBarRef = useRef<HTMLDivElement>(null);

  const updateProgress = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;

    const progressBar = progressBarRef.current;
    const rect = progressBar.getBoundingClientRect();
    const pos = e.clientX - rect.left;
    const percent = pos / progressBar.offsetWidth;

    const boundedPercent = Math.max(0, Math.min(1, percent));
    const newTime = boundedPercent * max;

    onChange(newTime);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    updateProgress(e);

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      const mouseEvent = e as unknown as React.MouseEvent<HTMLDivElement>;
      updateProgress(mouseEvent);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="flex w-full items-center gap-2">
      {showLabels && formatLabel && (
        <span className="min-w-[40px] text-right text-xs text-gray-400">{formatLabel(value)}</span>
      )}
      <div
        ref={progressBarRef}
        onMouseDown={handleMouseDown}
        className="bg-background-lighter group relative h-1 w-full cursor-pointer rounded-full"
      >
        <div
          className="group-hover:bg-primary absolute top-0 left-0 h-1 rounded-full bg-gray-200 transition-colors"
          style={{ width: `${(value / max) * 100}%` }}
        />
      </div>
      {showLabels && formatLabel && (
        <span className="min-w-[40px] text-xs text-gray-400">{formatLabel(max)}</span>
      )}
    </div>
  );
}
