import { Song } from '../types/song';

const API_BASE_URL = 'http://localhost:5133/api';

export const musicService = {
  async getSongs(): Promise<Song[]> {
    const response = await fetch(`${API_BASE_URL}/songs`);

    if (!response.ok) {
      throw new Error('Failed to fetch songs');
    }

    return response.json();
  },

  async getSong(id: string): Promise<Song> {
    const response = await fetch(`${API_BASE_URL}/songs/${id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch song');
    }

    return response.json();
  },

  getStreamUrl(songId: string): string {
    return `${API_BASE_URL}/songs/${songId}/stream`;
  },
};
