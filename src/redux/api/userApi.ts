import { createApi } from '@reduxjs/toolkit/query/react';
import { baseApiConfig } from './baseApi';

export const userApi = createApi({
  ...baseApiConfig,
  reducerPath: 'userApi',
  endpoints: (builder) => ({
    getCurrentUser: builder.query({
      query: () => '/users/me',
      providesTags: ['User'],
    }),
    createUser: builder.mutation({
      query: (userData) => ({
        url: '/users',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const { useGetCurrentUserQuery, useCreateUserMutation } = userApi;
