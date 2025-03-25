using Microsoft.AspNetCore.Mvc;
using MusicPlayer.Core.Interfaces;
using MusicPlayer.Core.Models;

namespace MusicPlayer.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SongsController(IMusicService musicService, IFileStorageService fileStorageService) : ControllerBase
{
  private readonly IMusicService _musicService = musicService;
  private readonly IFileStorageService _fileStorageService = fileStorageService;

  [HttpGet]
  public async Task<ActionResult<IEnumerable<Song>>> GetSongs()
  {
    var songs = await _musicService.GetAllSongsAsync();
    return Ok(songs);
  }

  [HttpGet("{id}")]
  public async Task<ActionResult<Song>> GetSong(Guid id)
  {
    var song = await _musicService.GetSongByIdAsync(id);
    if (song == null)
    {
      return NotFound();
    }

    return Ok(song);
  }

  [HttpGet("{id}/stream")]
  public async Task<IActionResult> StreamSong(Guid id)
  {
    var song = await _musicService.GetSongByIdAsync(id);
    if (song == null)
    {
      return NotFound();
    }

    var stream = await _fileStorageService.GetFileAsync(song.FilePath);
    return File(stream, "audio/mpeg");
  }
}