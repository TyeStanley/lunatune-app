using Microsoft.EntityFrameworkCore;
using MusicPlayer.Core.Interfaces;
using MusicPlayer.Core.Models;
using MusicPlayer.Infrastructure.Data;

namespace MusicPlayer.Infrastructure.Services;

public class UserService(ApplicationDbContext context) : IUserService
{
  private readonly ApplicationDbContext _context = context;

  public async Task<User?> GetUserByAuth0IdAsync(string auth0Id)
  {
    return await _context.Users.FirstOrDefaultAsync(u => u.Auth0Id == auth0Id);
  }

  public async Task<User> CreateUserAsync(User user)
  {
    _context.Users.Add(user);
    await _context.SaveChangesAsync();
    return user;
  }

  public async Task<bool> UserExistsAsync(string auth0Id)
  {
    return await _context.Users.AnyAsync(u => u.Auth0Id == auth0Id);
  }
}