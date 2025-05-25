import { Clock } from 'lucide-react';
import { Song } from '@/types/song';
import TrackItem from '@/components/TrackItem';

interface SongsListProps {
  songs: Song[];
  currentPage: number;
  isLoading: boolean;
  isFetching: boolean;
  error?: Error;
  emptyMessage?: string;
  useLocalStorage?: boolean;
}

export function SongsList({
  songs,
  currentPage,
  isLoading,
  isFetching,
  error,
  emptyMessage = 'No songs found',
  useLocalStorage = false,
}: SongsListProps) {
  const pageSize = songs.length > 0 ? songs.length : 10;

  if (isLoading || isFetching) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-gray-400">Loading songs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-gray-400">Error loading songs</p>
      </div>
    );
  }

  return songs.length > 0 ? (
    <table className="w-full">
      <thead className="border-b border-gray-700">
        <tr className="text-left text-gray-400">
          <th className="pb-2 text-center">#</th>
          <th className="pb-2">Title</th>
          <th className="hidden pb-2 sm:table-cell">Album</th>
          <th className="hidden pb-2 md:table-cell">Date added</th>
          {!useLocalStorage && <th className="pb-2">Likes</th>}
          <th className="ml-3 flex">
            <Clock size={18} className="text-gray-400" />
          </th>
        </tr>
      </thead>
      <tbody>
        {songs.map((song: Song, index: number) => (
          <TrackItem
            key={song.id}
            index={(currentPage - 1) * pageSize + index}
            song={song}
            useLocalStorage
          />
        ))}
      </tbody>
    </table>
  ) : (
    <div className="flex items-center justify-center py-8">
      <p className="text-gray-400">{emptyMessage}</p>
    </div>
  );
}
