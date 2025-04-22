import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5133/api';

let getAccessTokenSilently: (() => Promise<string>) | null = null;

export const configureTokenApi = (getToken: () => Promise<string>) => {
  getAccessTokenSilently = getToken;
};

export const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: async (headers) => {
    if (getAccessTokenSilently) {
      try {
        const token = await getAccessTokenSilently();

        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
      } catch (error) {
        console.error('Failed to get token:', error);
      }
    }
    return headers;
  },
});

export const baseApiConfig = {
  baseQuery,
  tagTypes: ['Song', 'User'],
  keepUnusedDataFor: 60,
};
