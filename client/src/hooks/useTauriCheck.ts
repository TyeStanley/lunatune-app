'use client';

import { useState, useEffect } from 'react';

export function useTauriCheck() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkTauri = async () => {
      try {
        const { invoke } = await import('@tauri-apps/api/tauri');
        await invoke('is_tauri');
        setIsDesktop(true);
      } catch {
        setIsDesktop(false);
      }
    };

    checkTauri();
  }, []);

  return isDesktop;
}
