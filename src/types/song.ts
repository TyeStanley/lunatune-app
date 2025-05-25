export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  genre?: string;
  filePath: string;
  durationMs: number;
  albumArtUrl?: string;
  createdAt: string;
  updatedAt?: string;
  isLiked: boolean;
  likeCount: number;
}
