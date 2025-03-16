using MusicPlayer.Core.Interfaces;
using MusicPlayer.Core.Models;

namespace MusicPlayer.Infrastructure.Services;

public class MusicService : IMusicService
{
  private readonly List<Song> _songs = new();

  public async Task<IEnumerable<Song>> GetAllSongsAsync()
  {
    return await Task.FromResult(_songs);
  }

  public async Task<Song?> GetSongByIdAsync(int id)
  {
    return await Task.FromResult(_songs.FirstOrDefault(s => s.Id == id));
  }

  public async Task<Song> AddSongAsync(Song song)
  {
    song.Id = _songs.Count + 1;
    _songs.Add(song);
    return await Task.FromResult(song);
  }

  public async Task<bool> UpdateSongAsync(Song song)
  {
    var existingSong = _songs.FirstOrDefault(s => s.Id == song.Id);
    if (existingSong == null) return false;

    existingSong.Title = song.Title;
    existingSong.Artist = song.Artist;
    existingSong.Album = song.Album;
    existingSong.Duration = song.Duration;
    existingSong.FilePath = song.FilePath;
    existingSong.IsFavorite = song.IsFavorite;
    existingSong.Genre = song.Genre;

    return await Task.FromResult(true);
  }

  public async Task<bool> DeleteSongAsync(int id)
  {
    var song = _songs.FirstOrDefault(s => s.Id == id);
    if (song == null) return false;

    _songs.Remove(song);
    return await Task.FromResult(true);
  }

  public async Task<IEnumerable<Song>> GetFavoriteSongsAsync()
  {
    return await Task.FromResult(_songs.Where(s => s.IsFavorite));
  }

  public async Task<bool> ToggleFavoriteAsync(int id)
  {
    var song = _songs.FirstOrDefault(s => s.Id == id);
    if (song == null) return false;

    song.IsFavorite = !song.IsFavorite;
    return await Task.FromResult(true);
  }
}