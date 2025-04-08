'use client';

import { Auth0Provider } from '@auth0/auth0-react';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { AppState } from '@auth0/auth0-react';

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();

  const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN!;
  const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!;
  const callbackUrl = process.env.NEXT_PUBLIC_AUTH0_CALLBACK_URL;
  const audience = process.env.NEXT_PUBLIC_AUTH0_AUDIENCE;

  if (!(domain && clientId && callbackUrl)) {
    return null;
  }

  const onRedirectCallback = (appState?: AppState) => {
    router.push(appState?.returnTo || window.location.pathname);
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
    >
      {children}
    </Auth0Provider>
  );
}
