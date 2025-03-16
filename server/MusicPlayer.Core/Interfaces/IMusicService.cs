using MusicPlayer.Core.Models;

namespace MusicPlayer.Core.Interfaces;

public interface IMusicService
{
  Task<IEnumerable<Song>> GetAllSongsAsync();
  Task<Song?> GetSongByIdAsync(int id);
  Task<Song> AddSongAsync(Song song);
  Task<bool> UpdateSongAsync(Song song);
  Task<bool> DeleteSongAsync(int id);
  Task<IEnumerable<Song>> GetFavoriteSongsAsync();
  Task<bool> ToggleFavoriteAsync(int id);
}