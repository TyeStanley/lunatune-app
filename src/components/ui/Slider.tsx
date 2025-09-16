'use client';

import { useRef, useState, useEffect } from 'react';

interface SliderProps {
  value: number;
  max: number;
  onChange: (value: number) => void;
  formatLabel?: (value: number) => string;
  showLabels?: boolean;
  seekOnDrag?: boolean;
}

export default function Slider({
  value,
  max,
  onChange,
  formatLabel,
  showLabels = false,
  seekOnDrag = false,
}: SliderProps) {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [localValue, setLocalValue] = useState(value);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!isDragging) {
      setLocalValue(value);
    }
  }, [value, isDragging]);

  const updateProgress = (e: React.MouseEvent<HTMLDivElement>, dragging: boolean) => {
    if (!progressBarRef.current) return;

    const progressBar = progressBarRef.current;
    const rect = progressBar.getBoundingClientRect();
    const pos = e.clientX - rect.left;
    const percent = pos / progressBar.offsetWidth;

    const boundedPercent = Math.max(0, Math.min(1, percent));
    const newTime = boundedPercent * max;

    setLocalValue(newTime);
    if (seekOnDrag || !dragging) {
      onChange(newTime);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    updateProgress(e, true);

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      const mouseEvent = e as unknown as React.MouseEvent<HTMLDivElement>;
      updateProgress(mouseEvent, true);
    };

    const handleMouseUp = (e: MouseEvent) => {
      const mouseEvent = e as unknown as React.MouseEvent<HTMLDivElement>;
      updateProgress(mouseEvent, false);
      requestAnimationFrame(() => {
        setIsDragging(false);
      });

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="flex w-full items-center gap-2">
      {showLabels && formatLabel && (
        <span className="min-w-[40px] text-right text-xs text-gray-400">
          {formatLabel(localValue)}
        </span>
      )}
      <div
        ref={progressBarRef}
        onMouseDown={handleMouseDown}
        className="bg-background-lighter group relative h-1 w-full cursor-pointer rounded-full"
        data-testid="progress-bar"
      >
        <div
          className="group-hover:bg-primary absolute top-0 left-0 h-1 rounded-full bg-gray-200 transition-colors"
          style={{ width: `${(localValue / max) * 100}%` }}
        />
      </div>
      {showLabels && formatLabel && (
        <span className="min-w-[40px] text-xs text-gray-400">{formatLabel(max)}</span>
      )}
    </div>
  );
}
