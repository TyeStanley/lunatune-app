using Microsoft.EntityFrameworkCore;
using MusicPlayer.Core.Models;

namespace MusicPlayer.Infrastructure.Data;

public static class DbSeeder
{
  public static async Task SeedDataAsync(ApplicationDbContext context)
  {
    // Only seed if the database is empty
    if (await context.Songs.AnyAsync())
    {
      return;
    }

    List<Song> songs = [
      new Song
      {
        Id = Guid.NewGuid(),
        Title = "Pop Corporate",
        Artist = "BlackTrendMusic",
        Album = "Pop Corporate",
        Genre = "Pop",
        Duration = TimeSpan.FromMinutes(1).Add(TimeSpan.FromSeconds(58)),
        FilePath = "music/pop-corporate.mp3",
        AlbumArtUrl = "https://example.com/pop_corporate_album.jpg",
        IsFavorite = false,
        CreatedAt = DateTime.UtcNow
      },
      new Song
      {
        Id = Guid.NewGuid(),
        Title = "Abstract Beauty",
        Artist = "BoDleasons",
        Album = "Moments of Inspiration",
        Genre = "Instrumental",
        Duration = TimeSpan.FromMinutes(1).Add(TimeSpan.FromSeconds(19)),
        FilePath = "music/abstract-beauty.mp3",
        AlbumArtUrl = "https://example.com/abstract_beauty_album.jpg",
        IsFavorite = false,
        CreatedAt = DateTime.UtcNow
      },
      new Song
      {
        Id = Guid.NewGuid(),
        Title = "50 Berkeley Square",
        Artist = "Nutmeg",
        Album = "Ghosts (and Goolies)",
        Genre = "Novelty",
        Duration = TimeSpan.FromMinutes(3).Add(TimeSpan.FromSeconds(40)),
        FilePath = "music/50-berkeley-square.mp3",
        AlbumArtUrl = "https://example.com/50_berkeley_square.jpg",
        IsFavorite = false,
        CreatedAt = DateTime.UtcNow
      }
    ];

    await context.Songs.AddRangeAsync(songs);
    await context.SaveChangesAsync();
  }
}