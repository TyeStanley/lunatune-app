import { createApi } from '@reduxjs/toolkit/query/react';
import { baseApiConfig } from './baseApi';
import { Song } from '@/types/song';

export const songApi = createApi({
  ...baseApiConfig,
  reducerPath: 'songApi',
  endpoints: (builder) => ({
    getSongs: builder.query<
      { songs: Song[]; totalPages: number },
      { searchTerm?: string; page?: number }
    >({
      query: ({ searchTerm = '', page = 1 } = {}) => {
        const params = new URLSearchParams();
        if (searchTerm) params.append('searchTerm', searchTerm);
        if (page) params.append('page', page.toString());
        return `/songs?${params.toString()}`;
      },
      providesTags: ['Song'],
    }),
    getLikedSongs: builder.query<
      { songs: Song[]; totalPages: number },
      { searchTerm?: string; page?: number }
    >({
      query: ({ page = 1 } = {}) => {
        const params = new URLSearchParams();
        if (page) params.append('page', page.toString());
        return `/songs/liked?${params.toString()}`;
      },
      providesTags: ['Song'],
    }),
    getPopularSongs: builder.query<
      { songs: Song[]; totalPages: number },
      { searchTerm?: string; page?: number }
    >({
      query: ({ searchTerm = '', page = 1 } = {}) => {
        const params = new URLSearchParams();
        if (searchTerm) params.append('searchTerm', searchTerm);
        if (page) params.append('page', page.toString());
        return `/songs/popular?${params.toString()}`;
      },
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
    likeSong: builder.mutation<void, string>({
      query: (id) => ({
        url: `/songs/${id}/like`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Song', id }],
    }),
    unlikeSong: builder.mutation<void, string>({
      query: (id) => ({
        url: `/songs/${id}/like`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Song', id }],
    }),
  }),
});

export const {
  useGetSongsQuery,
  useGetLikedSongsQuery,
  useGetPopularSongsQuery,
  useGetSongQuery,
  useGetStreamUrlQuery,
  useLikeSongMutation,
  useUnlikeSongMutation,
} = songApi;
