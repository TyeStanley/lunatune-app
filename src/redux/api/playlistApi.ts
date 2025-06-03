import { createApi } from '@reduxjs/toolkit/query/react';
import { baseApiConfig } from './baseApi';
import { Playlist } from '@/types/playlist';

export const playlistApi = createApi({
  ...baseApiConfig,
  reducerPath: 'playlistApi',
  endpoints: (builder) => ({
    // 1. Get user's playlists
    getUserPlaylists: builder.query<Playlist[], { searchTerm?: string }>({
      query: ({ searchTerm = '' } = {}) => {
        const params = new URLSearchParams();
        if (searchTerm) params.append('searchTerm', searchTerm);
        return `/playlist?${params.toString()}`;
      },
    }),

    // 2. Get all public playlists (with pagination)
    getAllPlaylists: builder.query<
      { playlists: Playlist[]; totalPages: number },
      { searchTerm?: string; page?: number; pageSize?: number }
    >({
      query: ({ searchTerm = '', page = 1, pageSize = 10 }) => {
        const params = new URLSearchParams();
        if (searchTerm) params.append('searchTerm', searchTerm);
        if (page) params.append('page', page.toString());
        if (pageSize) params.append('pageSize', pageSize.toString());
        return `/playlist/all?${params.toString()}`;
      },
    }),

    // 3. Get single playlist by id
    getPlaylist: builder.query<Playlist, string>({
      query: (id) => `/playlist/${id}`,
    }),

    // 4. Create playlist
    createPlaylist: builder.mutation<Playlist, { name: string; description?: string }>({
      query: (body) => ({
        url: '/playlist',
        method: 'POST',
        body,
      }),
    }),

    // 5. Add song to playlist
    addSongToPlaylist: builder.mutation<void, { playlistId: string; songId: string }>({
      query: ({ playlistId, songId }) => ({
        url: `/playlist/${playlistId}/songs/${songId}`,
        method: 'POST',
      }),
    }),

    // 6. Remove song from playlist
    removeSongFromPlaylist: builder.mutation<void, { playlistId: string; songId: string }>({
      query: ({ playlistId, songId }) => ({
        url: `/playlist/${playlistId}/songs/${songId}`,
        method: 'DELETE',
      }),
    }),

    // 7. Delete playlist
    deletePlaylist: builder.mutation<void, string>({
      query: (id) => ({
        url: `/playlist/${id}`,
        method: 'DELETE',
      }),
    }),

    // 8. Add playlist to library
    addPlaylistToLibrary: builder.mutation<void, { playlistId: string }>({
      query: ({ playlistId }) => ({
        url: `/playlist/${playlistId}/library`,
        method: 'POST',
      }),
    }),

    // 9. Remove playlist from library
    removePlaylistFromLibrary: builder.mutation<void, { playlistId: string }>({
      query: ({ playlistId }) => ({
        url: `/playlist/${playlistId}/library`,
        method: 'DELETE',
      }),
    }),

    // 10. Edit playlist (update name/description)
    editPlaylist: builder.mutation<Playlist, { id: string; name: string; description?: string }>({
      query: ({ id, name, description }) => ({
        url: `/playlist/${id}`,
        method: 'PATCH',
        body: { name, description },
      }),
    }),
  }),
});

export const {
  useGetUserPlaylistsQuery,
  useGetAllPlaylistsQuery,
  useGetPlaylistQuery,
  useCreatePlaylistMutation,
  useAddSongToPlaylistMutation,
  useRemoveSongFromPlaylistMutation,
  useDeletePlaylistMutation,
  useAddPlaylistToLibraryMutation,
  useRemovePlaylistFromLibraryMutation,
  useEditPlaylistMutation,
} = playlistApi;
