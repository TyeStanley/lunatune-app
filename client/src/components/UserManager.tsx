'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { configureTokenApi } from '@/redux/api/baseApi';
import { setAccessToken } from '@/redux/state/auth/authSlice';
import { useCreateUserMutation, useGetCurrentUserQuery } from '@/redux/api/userApi';
import { updateUser, clearUser } from '@/redux/state/user/userSlice';
import { useAppDispatch } from '@/redux/hooks';

export default function UserManager() {
  const dispatch = useAppDispatch();
  const { getAccessTokenSilently, isAuthenticated, user } = useAuth();
  const [createUser] = useCreateUserMutation();
  const {
    data: currentUser,
    isLoading: isUserLoading,
    error: userError,
  } = useGetCurrentUserQuery(undefined, {
    skip: !isAuthenticated,
  });

  // Handle token and user state management
  useEffect(() => {
    const handleTokenAndUser = async () => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently();
          configureTokenApi(getAccessTokenSilently);
          dispatch(setAccessToken(token));

          // Create user if they don't exist or if there was an error fetching the user
          if (user && (!currentUser || userError) && !isUserLoading) {
            try {
              await createUser({
                email: user.email!,
                name: user.name,
                picture: user.picture,
              });
            } catch (error) {
              console.error('UserManager: Error creating user:', error);
            }
          }

          // Update user in Redux if they exist
          if (currentUser) {
            dispatch(
              updateUser({
                id: currentUser.id,
                email: currentUser.email,
                name: currentUser.name,
                picture: currentUser.picture,
                createdAt: currentUser.createdAt,
                updatedAt: currentUser.updatedAt,
              }),
            );
          }
        } catch (error) {
          console.error('UserManager: Error handling token and user:', error);
        }
      } else {
        dispatch(clearUser());
      }
    };

    handleTokenAndUser();
  }, [
    isAuthenticated,
    user,
    currentUser,
    isUserLoading,
    userError,
    getAccessTokenSilently,
    dispatch,
    createUser,
  ]);

  return null;
}
