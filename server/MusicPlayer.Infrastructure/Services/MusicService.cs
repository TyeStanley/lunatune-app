using MusicPlayer.Core.Interfaces;
using MusicPlayer.Core.Models;

namespace MusicPlayer.Infrastructure.Services;

public class MusicService : IMusicService
{
  private readonly List<Song> _songs = [];

  public MusicService()
  {
    _songs = [
      new Song
      {
        Id = Guid.NewGuid(),
        Title = "Bohemian Rhapsody",
        Artist = "Queen",
        Album = "A Night at the Opera",
        Genre = "Rock",
        Duration = TimeSpan.FromMinutes(5).Add(TimeSpan.FromSeconds(55)),
        FilePath = "/music/bohemian_rhapsody.mp3",
        AlbumArtUrl = "https://example.com/queen_album.jpg",
        IsFavorite = false,
        CreatedAt = DateTime.UtcNow
      },
      new Song
      {
        Id = Guid.NewGuid(),
        Title = "Billie Jean",
        Artist = "Michael Jackson",
        Album = "Thriller",
        Genre = "Pop",
        Duration = TimeSpan.FromMinutes(4).Add(TimeSpan.FromSeconds(54)),
        FilePath = "/music/billie_jean.mp3",
        AlbumArtUrl = "https://example.com/thriller_album.jpg",
        IsFavorite = true,
        CreatedAt = DateTime.UtcNow.AddDays(-1)
      },
      new Song
      {
        Id = Guid.NewGuid(),
        Title = "Sweet Child O' Mine",
        Artist = "Guns N' Roses",
        Album = "Appetite for Destruction",
        Genre = "Rock",
        Duration = TimeSpan.FromMinutes(5).Add(TimeSpan.FromSeconds(56)),
        FilePath = "/music/sweet_child.mp3",
        AlbumArtUrl = "https://example.com/gnr_album.jpg",
        IsFavorite = false,
        CreatedAt = DateTime.UtcNow.AddDays(-2)
      }
    ];
  }

  public async Task<IEnumerable<Song>> GetAllSongsAsync()
  {
    return await Task.FromResult(_songs);
  }
}