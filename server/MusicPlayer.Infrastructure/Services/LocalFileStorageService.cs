using Microsoft.AspNetCore.Hosting;
using MusicPlayer.Core.Interfaces;

namespace MusicPlayer.Infrastructure.Services;

public class LocalFileStorageService(IWebHostEnvironment environment) : IFileStorageService
{
  private readonly IWebHostEnvironment _environment = environment;

  public async Task<Stream> GetFileAsync(string filePath)
  {
    var fullPath = Path.Combine(_environment.WebRootPath ?? _environment.ContentRootPath, filePath);
    if (!File.Exists(fullPath))
    {
      throw new FileNotFoundException($"File not found: {filePath}");
    }

    return await Task.FromResult(new FileStream(fullPath, FileMode.Open, FileAccess.Read));
  }
}