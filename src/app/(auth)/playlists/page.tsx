'use client';

import { Music, User, Users, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { SearchInput } from '@/components/ui/SearchInput';
import { Pagination } from '@/components/ui/Pagination';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import {
  useAddPlaylistToLibraryMutation,
  useRemovePlaylistFromLibraryMutation,
  useDeletePlaylistMutation,
  useGetAllPlaylistsQuery,
} from '@/redux/api/playlistApi';
import type { Playlist } from '@/types/playlist';

interface DeletePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  playlistName: string;
  onConfirm: () => Promise<void>;
}

export default function PlaylistsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialSearch = searchParams.get('search') || '';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 400);

  const [addPlaylistToLibrary] = useAddPlaylistToLibraryMutation();
  const [removePlaylistFromLibrary] = useRemovePlaylistFromLibraryMutation();
  const [deletePlaylist] = useDeletePlaylistMutation();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearchQuery) params.set('search', debouncedSearchQuery);
    if (currentPage > 1) params.set('page', String(currentPage));
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [debouncedSearchQuery, currentPage, router]);

  const { data, isLoading, error, refetch } = useGetAllPlaylistsQuery(
    {
      searchTerm: debouncedSearchQuery,
      page: currentPage,
      pageSize: 10,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const totalPages = data?.totalPages || 1;

  const handleLibraryAction = async (playlist: Playlist) => {
    try {
      if (playlist.isCreator) {
        await deletePlaylist(playlist.id).unwrap();
      } else if (playlist.isInLibrary) {
        await removePlaylistFromLibrary({ playlistId: playlist.id }).unwrap();
      } else {
        await addPlaylistToLibrary({ playlistId: playlist.id }).unwrap();
      }
      refetch();
    } catch (error) {
      console.error('Failed to update library:', error);
    }
  };

  const handleDeleteClick = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedPlaylist) {
      await deletePlaylist(selectedPlaylist.id).unwrap();
      refetch();
    }
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader icon={Music} title="Discover Playlists" />

      <div className="bg-background-lighter/20 rounded-lg border border-white/5 p-6 backdrop-blur-md">
        <div className="mb-4 flex flex-col items-stretch gap-4 md:mb-8 md:flex-row md:items-center md:justify-between">
          <SearchInput
            value={searchQuery}
            onChange={(value) => {
              setSearchQuery(value);
              setCurrentPage(1);
            }}
            placeholder="Search playlists"
          />
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="py-8 text-center text-red-500">
            Error loading playlists. Please try again.
          </div>
        ) : data?.playlists.length === 0 ? (
          <div className="py-8 text-center text-gray-400">No playlists found</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data?.playlists.map((playlist: Playlist) => (
              <div
                key={playlist.id}
                className="group from-background-lighter/20 via-background-lighter/10 to-background-lighter/5 hover:from-background-lighter/30 hover:via-background-lighter/20 hover:to-background-lighter/10 relative flex h-full flex-col overflow-hidden rounded-lg border border-white/5 bg-gradient-to-br p-4 transition-all"
              >
                <div className="from-primary/5 absolute inset-0 bg-gradient-to-br via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative flex-grow">
                  <div className="flex gap-3">
                    <div className="mt-1">
                      {playlist.isCreator ? (
                        <User className="text-primary size-8" />
                      ) : (
                        <Users className="size-8 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{playlist.name}</h3>
                      {playlist.description && (
                        <p className="text-sm text-gray-400">{playlist.description}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => router.push(`/playlists/${playlist.id}`)}
                    className="bg-primary/90 hover:bg-primary flex-1 rounded-md px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all"
                  >
                    View Playlist
                  </button>
                  {playlist.isCreator ? (
                    <button
                      onClick={() => handleDeleteClick(playlist)}
                      className="flex-1 rounded-md bg-red-500/90 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-red-500"
                    >
                      Delete
                    </button>
                  ) : (
                    <button
                      onClick={() => handleLibraryAction(playlist)}
                      className={`flex-1 rounded-md px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all ${
                        playlist.isInLibrary
                          ? 'bg-gray-600/90 hover:bg-gray-600'
                          : 'bg-cyan-500/90 hover:bg-cyan-500'
                      }`}
                    >
                      {playlist.isInLibrary ? 'Remove from Library' : 'Add to Library'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <DeletePlaylistModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedPlaylist(null);
        }}
        playlistName={selectedPlaylist?.name || ''}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

function DeletePlaylistModal({
  isOpen,
  onClose,
  playlistName,
  onConfirm,
}: DeletePlaylistModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      await onConfirm();
      onClose();
    } catch {
      setError('Failed to delete playlist. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-40 w-full max-w-md">
        <div className="bg-background-lighter/20 rounded-xl border border-white/5 p-6 backdrop-blur-md">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-200">Delete Playlist</h2>
            <button
              onClick={onClose}
              className="rounded-full p-1 text-gray-400 hover:bg-white/5 hover:text-gray-200"
            >
              <span className="sr-only">Close</span>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flex flex-col items-center justify-center py-4">
            <AlertTriangle size={48} className="mb-4 text-red-500" />
            <p className="text-center text-gray-200">
              Are you sure you want to delete <span className="font-semibold">{playlistName}</span>?
              This action cannot be undone.
            </p>
          </div>
          <div className="mt-6 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-md bg-gray-600/90 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-gray-600"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 rounded-md bg-red-500/90 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-red-500 disabled:opacity-50"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
          {error && <div className="mt-3 text-center text-sm text-red-400">{error}</div>}
        </div>
      </div>
    </div>
  );
}
