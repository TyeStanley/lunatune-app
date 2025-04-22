'use client';

import { useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '../redux/store';
import { useAuth } from '@/hooks/useAuth';
import { configureTokenApi } from '@/redux/api/baseApi';
import { setAccessToken } from '../redux/state/auth/authSlice';

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const { getAccessTokenSilently } = useAuth();
  const storeRef = useRef<AppStore>(undefined);

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  // Sets the token for redux-toolkit-api and Redux store
  useEffect(() => {
    const configureToken = async () => {
      try {
        const token = await getAccessTokenSilently();
        configureTokenApi(getAccessTokenSilently);
        storeRef.current?.dispatch(setAccessToken(token));
      } catch (error) {
        console.error('Failed to get access token:', error);
      }
    };
    configureToken();
  }, [getAccessTokenSilently]);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
