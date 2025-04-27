'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { configureTokenApi } from '@/redux/api/baseApi';
import { setAccessToken } from '@/redux/state/auth/authSlice';
import { useCreateUserMutation, useGetCurrentUserQuery } from '@/redux/api/userApi';
import { updateUser, clearUser } from '@/redux/state/user/userSlice';
import { useAppDispatch } from '@/redux/hooks';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

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

  // Fetch token and configure API
  useEffect(() => {
    const fetchToken = async () => {
      const token = await getAccessTokenSilently();
      configureTokenApi(getAccessTokenSilently);
      dispatch(setAccessToken(token));
    };
    fetchToken();
  }, [getAccessTokenSilently, dispatch]);

  // Handle user creation
  useEffect(() => {
    const handleUser = async () => {
      if (!isAuthenticated) {
        dispatch(clearUser());
        return;
      }

      if (
        user &&
        !currentUser &&
        !isUserLoading &&
        userError &&
        (userError as FetchBaseQueryError).status === 404
      ) {
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
    };

    handleUser();
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
