export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  genre?: string;
  filePath: string;
  duration: string;
  albumArtUrl?: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt?: string;
}
