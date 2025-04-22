'use client';

import { Auth0Provider } from '@auth0/auth0-react';
import { ReactNode } from 'react';
import { AppState } from '@auth0/auth0-react';

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN!;
  const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!;
  const callbackUrl = process.env.NEXT_PUBLIC_AUTH0_CALLBACK_URL;
  const audience = process.env.NEXT_PUBLIC_AUTH0_AUDIENCE;

  if (!(domain && clientId && callbackUrl)) {
    console.error('Missing required Auth0 configuration');
    return null;
  }

  const onRedirectCallback = (appState?: AppState) => {
    if (appState?.returnTo) {
      window.location.href = appState.returnTo;
    } else {
      window.location.href = window.location.pathname;
    }
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: callbackUrl,
        audience: audience,
      }}
      onRedirectCallback={onRedirectCallback}
      cacheLocation="localstorage"
    >
      {children}
    </Auth0Provider>
  );
}
