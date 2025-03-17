namespace MusicPlayer.Core.Models;

public class Song
{
  public int Id { get; set; }
  public required string Title { get; set; }
  public required string Artist { get; set; }
  public string? Album { get; set; }
  public string? Genre { get; set; }

  // File essentials
  public required string FilePath { get; set; }
  public TimeSpan Duration { get; set; }
  public string? AlbumArtUrl { get; set; }

  // Basic user interaction
  public bool IsFavorite { get; set; }
  public DateTime DateAdded { get; set; } = DateTime.UtcNow;
}