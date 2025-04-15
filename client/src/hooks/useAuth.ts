import { useAuth0 } from '@auth0/auth0-react';

export const useAuth = () => {
  const {
    isAuthenticated,
    isLoading,
    error,
    user,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
  } = useAuth0();

  const login = () => {
    const returnTo = localStorage.getItem('returnTo');
    loginWithRedirect({
      appState: {
        returnTo: returnTo || '/dashboard',
      },
      authorizationParams: {
        prompt: 'login',
      },
    });
    localStorage.removeItem('returnTo');
  };

  const signOut = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  return {
    isAuthenticated,
    isLoading,
    error,
    user,
    login,
    signOut,
    getAccessTokenSilently,
  };
};
