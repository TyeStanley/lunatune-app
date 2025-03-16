using Microsoft.AspNetCore.Mvc;
using MusicPlayer.Core.Interfaces;
using MusicPlayer.Core.Models;

namespace MusicPlayer.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SongsController : ControllerBase
{
  private readonly IMusicService _musicService;

  public SongsController(IMusicService musicService)
  {
    _musicService = musicService;
  }

  [HttpGet]
  public async Task<ActionResult<IEnumerable<Song>>> GetSongs()
  {
    var songs = await _musicService.GetAllSongsAsync();
    return Ok(songs);
  }

  [HttpGet("{id}")]
  public async Task<ActionResult<Song>> GetSong(int id)
  {
    var song = await _musicService.GetSongByIdAsync(id);
    if (song == null)
    {
      return NotFound();
    }
    return Ok(song);
  }

  [HttpPost]
  public async Task<ActionResult<Song>> CreateSong(Song song)
  {
    var createdSong = await _musicService.AddSongAsync(song);
    return CreatedAtAction(nameof(GetSong), new { id = createdSong.Id }, createdSong);
  }

  [HttpPut("{id}")]
  public async Task<IActionResult> UpdateSong(int id, Song song)
  {
    if (id != song.Id)
    {
      return BadRequest();
    }

    var success = await _musicService.UpdateSongAsync(song);
    if (!success)
    {
      return NotFound();
    }

    return NoContent();
  }

  [HttpDelete("{id}")]
  public async Task<IActionResult> DeleteSong(int id)
  {
    var success = await _musicService.DeleteSongAsync(id);
    if (!success)
    {
      return NotFound();
    }

    return NoContent();
  }

  [HttpGet("favorites")]
  public async Task<ActionResult<IEnumerable<Song>>> GetFavoriteSongs()
  {
    var songs = await _musicService.GetFavoriteSongsAsync();
    return Ok(songs);
  }

  [HttpPost("{id}/toggle-favorite")]
  public async Task<IActionResult> ToggleFavorite(int id)
  {
    var success = await _musicService.ToggleFavoriteAsync(id);
    if (!success)
    {
      return NotFound();
    }

    return NoContent();
  }
}