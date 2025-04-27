import { createApi } from '@reduxjs/toolkit/query/react';
import { baseApiConfig } from './baseApi';

export const songApi = createApi({
  ...baseApiConfig,
  reducerPath: 'songApi',
  endpoints: (builder) => ({
    getSongs: builder.query({
      query: () => '/songs',
      providesTags: ['Song'],
    }),
    getSong: builder.query({
      query: (id) => `/songs/${id}`,
      providesTags: (result, error, id) => [{ type: 'Song', id }],
    }),
    getStreamUrl: builder.query<{ streamUrl: string }, string>({
      query: (id) => `/songs/${id}/stream`,
      providesTags: (result, error, id) => [{ type: 'Song', id }],
    }),
  }),
});

export const { useGetSongsQuery, useGetSongQuery, useGetStreamUrlQuery } = songApi;
