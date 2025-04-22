using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MusicPlayer.Core.Interfaces;
using MusicPlayer.Core.Models;

namespace MusicPlayer.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
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
  [AllowAnonymous]
  public async Task<IActionResult> StreamSong(Guid id)
  {
    var song = await _musicService.GetSongByIdAsync(id);
    if (song == null)
    {
      return NotFound();
    }

    try
    {
      var audioStream = await _fileStorageService.GetFileAsync(song.FilePath);
      return File(audioStream, "audio/mpeg", enableRangeProcessing: true);
    }
    catch (Exception)
    {
      return StatusCode(500, "Error streaming file");
    }
  }
}