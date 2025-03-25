using MusicPlayer.Core.Models;

namespace MusicPlayer.Core.Interfaces;

public interface IMusicService
{
  Task<IEnumerable<Song>> GetAllSongsAsync();
  Task<Song?> GetSongByIdAsync(Guid id);
}