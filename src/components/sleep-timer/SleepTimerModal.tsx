import { X, Timer } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  setSleepTimer,
  clearSleepTimer,
  pause,
} from '@/redux/state/playback-controls/playbackControlsSlice';
import { useEffect, useState } from 'react';

interface SleepTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const timerOptions = [
  { label: '15 minutes', value: 15 },
  { label: '30 minutes', value: 30 },
  { label: '45 minutes', value: 45 },
  { label: '1 hour', value: 60 },
  { label: '1.5 hours', value: 90 },
  { label: '2 hours', value: 120 },
];

function formatTimeLeft(timeLeftMs: number): string {
  const minutes = Math.floor(timeLeftMs / (1000 * 60));
  const seconds = Math.floor((timeLeftMs % (1000 * 60)) / 1000);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export default function SleepTimerModal({ isOpen, onClose }: SleepTimerModalProps) {
  const dispatch = useAppDispatch();
  const { sleepTimer } = useAppSelector((state) => state.playbackControls);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (!sleepTimer.isActive || !sleepTimer.endTime) return;

    const updateTimeLeft = () => {
      const now = Date.now();
      const remaining = sleepTimer.endTime! - now;

      if (remaining <= 0) {
        // Timer has ended
        dispatch(pause());
        dispatch(clearSleepTimer());
        onClose();
        return;
      }

      setTimeLeft(remaining);
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [sleepTimer.isActive, sleepTimer.endTime, dispatch, onClose]);

  if (!isOpen) return null;

  const handleSetTimer = (minutes: number) => {
    dispatch(setSleepTimer(minutes));
    onClose();
  };

  const handleClearTimer = () => {
    dispatch(clearSleepTimer());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        data-testid="backdrop"
      />
      <div className="relative z-40 w-full max-w-md">
        <div className="bg-background-lighter/20 rounded-xl border border-white/5 p-6 backdrop-blur-md">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Timer size={20} className="text-primary" />
              <h2 className="text-xl font-semibold text-gray-200">Sleep Timer</h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1 text-gray-400 hover:bg-white/5 hover:text-gray-200"
              aria-label="close"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mb-6">
            {sleepTimer.isActive ? (
              <div className="space-y-2">
                <p className="text-gray-400">Timer set for {sleepTimer.duration} minutes.</p>
                <p className="text-primary text-2xl font-semibold">{formatTimeLeft(timeLeft)}</p>
              </div>
            ) : (
              <p className="text-gray-400">Select when to stop playing music</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {timerOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSetTimer(option.value)}
                className="group hover:bg-background-light/40 bg-background-lighter/30 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-white/5 p-4 backdrop-blur-sm transition-all duration-300 hover:border-white/10"
              >
                <div className="bg-background-light/40 flex h-12 w-12 items-center justify-center rounded-full border border-white/5 backdrop-blur-sm">
                  <Timer size={20} className="text-primary" />
                </div>
                <p className="group-hover:text-primary text-sm font-medium text-gray-200">
                  {option.label}
                </p>
              </button>
            ))}
          </div>

          {sleepTimer.isActive && (
            <button
              onClick={handleClearTimer}
              className="mt-4 w-full rounded-lg bg-red-500/20 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/30"
            >
              {timeLeft > 0 ? 'Cancel Timer' : 'Clear Timer'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
