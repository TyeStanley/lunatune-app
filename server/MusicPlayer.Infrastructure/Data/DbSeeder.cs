using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using MusicPlayer.Core.Models;

namespace MusicPlayer.Infrastructure.Data;

public static class DbSeeder
{
  private static readonly JsonSerializerOptions _jsonOptions = new()
  {
    PropertyNameCaseInsensitive = true
  };

  public static async Task SeedDataAsync(ApplicationDbContext context, bool forceReseed = false)
  {
    // Only seed if the database is empty or force reseed is true
    if (!forceReseed && await context.Songs.AnyAsync())
    {
      return;
    }

    // If force reseed is true, clear existing data
    if (forceReseed)
    {
      context.Songs.RemoveRange(context.Songs);
      await context.SaveChangesAsync();
    }

    // Read the seed data from JSON file
    var jsonPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Data", "songs.json");
    var jsonContent = await File.ReadAllTextAsync(jsonPath);
    var songs = JsonSerializer.Deserialize<List<Song>>(jsonContent, _jsonOptions)
        ?? throw new InvalidOperationException("Failed to deserialize songs from JSON file");

    await context.Songs.AddRangeAsync(songs);
    await context.SaveChangesAsync();
  }
}