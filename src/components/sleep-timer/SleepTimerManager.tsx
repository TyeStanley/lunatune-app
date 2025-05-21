'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { pause, clearSleepTimer } from '@/redux/state/playback-controls/playbackControlsSlice';

export default function SleepTimerManager() {
  const dispatch = useAppDispatch();
  const { sleepTimer } = useAppSelector((state) => state.playbackControls);

  useEffect(() => {
    if (!sleepTimer.isActive || !sleepTimer.endTime) return;

    const checkTimer = () => {
      const now = Date.now();
      if (now >= sleepTimer.endTime!) {
        dispatch(pause());
        dispatch(clearSleepTimer());
      }
    };

    const interval = setInterval(checkTimer, 1000);

    return () => clearInterval(interval);
  }, [sleepTimer.isActive, sleepTimer.endTime, dispatch]);

  return null;
}
