using Microsoft.AspNetCore.Mvc;
using MusicPlayer.Core.Interfaces;
using MusicPlayer.Core.Models;

namespace MusicPlayer.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SongsController(IMusicService musicService) : ControllerBase
{
  private readonly IMusicService _musicService = musicService;

  [HttpGet]
  public async Task<ActionResult<IEnumerable<Song>>> GetSongs()
  {
    var songs = await _musicService.GetAllSongsAsync();
    return Ok(songs);
  }
}