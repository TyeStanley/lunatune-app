'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface SliderProps {
  value: number;
  max: number;
  onChange: (value: number) => void;
  formatLabel?: (value: number) => string;
  showLabels?: boolean;
  className?: string;
}

export default function Slider({
  value,
  max,
  onChange,
  formatLabel,
  showLabels = false,
  className = '',
}: SliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percentage = x / rect.width;
      const newValue = Math.floor(percentage * max);

      if (!isNaN(newValue)) {
        onChange(Math.max(0, Math.min(newValue, max)));
      }
    },
    [max, onChange],
  );

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleMove(e.clientX);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleMove(e.clientX);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMove]);

  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;

  return (
    <div className={`flex w-full items-center gap-2 ${className}`}>
      {showLabels && formatLabel && (
        <span className="min-w-[40px] text-right text-xs text-gray-400">{formatLabel(value)}</span>
      )}
      <div
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        className="bg-background-lighter group relative h-1 w-full cursor-pointer rounded-full"
      >
        <div
          className="group-hover:bg-primary absolute top-0 left-0 h-1 rounded-full bg-gray-200 transition-colors"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabels && formatLabel && (
        <span className="min-w-[40px] text-xs text-gray-400">{formatLabel(max)}</span>
      )}
    </div>
  );
}
