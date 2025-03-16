namespace MusicPlayer.Core.Models;

public class Song
{
  public int Id { get; set; }
  public required string Title { get; set; }
  public required string Artist { get; set; }
  public string? Album { get; set; }
  public TimeSpan Duration { get; set; }
  public required string FilePath { get; set; }
  public bool IsFavorite { get; set; }
  public DateTime DateAdded { get; set; } = DateTime.UtcNow;
  public string? Genre { get; set; }
}