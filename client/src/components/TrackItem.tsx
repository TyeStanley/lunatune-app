import { Play, Heart, MoreHorizontal } from 'lucide-react';

interface TrackItemProps {
  title: string;
  artist: string;
  album: string;
  dateAdded: string;
  duration: string;
  // We'll add more props later like albumArt, id, etc.
}

export default function TrackItem({ title, artist, album, dateAdded, duration }: TrackItemProps) {
  return (
    <div
      className="group hover:bg-background-lighter focus:from-background-lighter focus:to-primary/30 relative flex items-center rounded-md p-4 transition-all duration-300 ease-in-out focus:bg-gradient-to-l"
      tabIndex={0}
    >
      {/* Track Number/Play Button Area */}
      <div className="mr-4 flex w-8 items-center justify-center">
        <span className="text-base text-gray-400 group-focus-within:hidden group-hover:hidden">
          1
        </span>
        <button
          className="hover:text-primary hidden text-gray-200 group-focus-within:block group-hover:block"
          aria-label="Play"
        >
          <Play size={20} />
        </button>
      </div>

      {/* Album Art */}
      <div className="bg-background-lighter mr-4 h-10 w-10 flex-shrink-0 overflow-hidden rounded">
        <div className="h-full w-full"></div>
      </div>

      {/* Song Info */}
      <div className="flex flex-1 items-center">
        {/* Title and Artist */}
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-normal text-gray-200">{title}</h3>
          <p className="truncate text-sm text-gray-400">{artist}</p>
        </div>

        {/* Album Name */}
        <div className="hidden flex-1 px-4 text-sm text-gray-400 md:block">
          <p className="truncate">{album}</p>
        </div>

        {/* Date Added */}
        <div className="hidden w-32 text-sm text-gray-400 md:block">
          <p className="truncate">{dateAdded}</p>
        </div>

        {/* Action Buttons and Duration */}
        <div className="flex items-center space-x-4">
          <button
            className="hover:text-primary invisible text-gray-400 group-focus-within:visible group-hover:visible"
            aria-label="Like"
          >
            <Heart size={18} />
          </button>
          <span className="text-sm text-gray-400">{duration}</span>
          <button
            className="hover:text-primary invisible text-gray-400 group-focus-within:visible group-hover:visible"
            aria-label="More options"
          >
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
