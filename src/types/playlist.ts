import { Song } from './song';

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  songs?: Song[];
  createdAt: string;
  updatedAt: string;
  userId: string;
  isCreator?: boolean;
  isInLibrary?: boolean;
  isPublic: boolean;
  creator: {
    username: string;
  };
}
