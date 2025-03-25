namespace MusicPlayer.Core.Interfaces;

public interface IFileStorageService
{
  Task<Stream> GetFileAsync(string filePath);
}