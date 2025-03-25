using Microsoft.EntityFrameworkCore;
using MusicPlayer.Core.Interfaces;
using MusicPlayer.Core.Models;
using MusicPlayer.Infrastructure.Data;

namespace MusicPlayer.Infrastructure.Services;

public class MusicService(ApplicationDbContext context) : IMusicService
{
  private readonly ApplicationDbContext _context = context;

  public async Task<IEnumerable<Song>> GetAllSongsAsync()
  {
    return await _context.Songs.ToListAsync();
  }

  public async Task<Song?> GetSongByIdAsync(Guid id)
  {
    return await _context.Songs.FindAsync(id);
  }
}