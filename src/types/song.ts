export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  genre?: string;
  filePath: string;
  durationMs: number;
  albumArtUrl?: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt?: string;
}
