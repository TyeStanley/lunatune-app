'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { configureTokenApi } from '@/redux/api/baseApi';

interface ApiProviderProps {
  children: React.ReactNode;
}

export default function ApiProvider({ children }: ApiProviderProps) {
  const { getAccessTokenSilently } = useAuth();

  useEffect(() => {
    configureTokenApi(getAccessTokenSilently);
  }, [getAccessTokenSilently]);

  return <>{children}</>;
}
