# Music Player Server Structure

This document outlines the structure and purpose of each component in the server application.

## Solution Structure

```
server/
├── MusicPlayer.sln               # Solution file that manages all projects
│
├── MusicPlayer.Core/             # Core business logic and interfaces
│   ├── Models/                   # Domain models
│   │   └── Song.cs               # Song entity definition
│   ├── Interfaces/               # Contracts/interfaces
│   │   └── IMusicService.cs      # Music service contract
│   └── MusicPlayer.Core.csproj
│
├── MusicPlayer.Infrastructure/   # Implementation of core interfaces
│   ├── Services/                 # Service implementations
│   │   └── MusicService.cs       # Implementation of IMusicService
│   └── MusicPlayer.Infrastructure.csproj
│
└── MusicPlayer.API/              # Web API layer
    ├── Controllers/              # API endpoints
    │   └── SongsController.cs    # Handles song-related HTTP requests
    ├── Properties/               # Project settings
    │   └── launchSettings.json   # Development server configuration
    ├── Program.cs                # Application entry point
    └── MusicPlayer.API.csproj
```

## Project Descriptions

### MusicPlayer.Core

- Contains domain models and business logic
- Defines interfaces that other projects implement
- No dependencies on other projects
- Framework-independent business rules
- Examples:
  - Domain models like `Song`
  - Service interfaces like `IMusicService`

### MusicPlayer.Infrastructure

- Implements interfaces defined in Core
- Handles data access and external services
- Dependencies:
  - References MusicPlayer.Core
- Examples:
  - Database operations
  - File system operations
  - External service integrations

### MusicPlayer.API

- Handles HTTP requests
- Exposes REST API endpoints
- Dependencies:
  - References MusicPlayer.Core
  - References MusicPlayer.Infrastructure
- Examples:
  - REST endpoints
  - Request/Response handling
  - API configuration

## Key Components

### Models

```csharp
// MusicPlayer.Core/Models/Song.cs
public class Song
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public required string Artist { get; set; }
    // ... other properties
}
```

### Interfaces

```csharp
// MusicPlayer.Core/Interfaces/IMusicService.cs
public interface IMusicService
{
    Task<IEnumerable<Song>> GetAllSongsAsync();
    Task<Song?> GetSongByIdAsync(int id);
    // ... other methods
}
```

### Services

```csharp
// MusicPlayer.Infrastructure/Services/MusicService.cs
public class MusicService : IMusicService
{
    // Implementation of IMusicService
}
```

### Controllers

```csharp
// MusicPlayer.API/Controllers/SongsController.cs
[ApiController]
[Route("api/[controller]")]
public class SongsController : ControllerBase
{
    private readonly IMusicService _musicService;
    // API endpoints
}
```

## API Endpoints

- `GET /api/songs` - Get all songs
- `GET /api/songs/{id}` - Get specific song
- `POST /api/songs` - Create new song
- `PUT /api/songs/{id}` - Update song
- `DELETE /api/songs/{id}` - Delete song
- `GET /api/songs/favorites` - Get favorite songs
- `POST /api/songs/{id}/toggle-favorite` - Toggle favorite status

## Project Dependencies

```
MusicPlayer.API
    ↓
    depends on
    ↓
MusicPlayer.Infrastructure
    ↓
    depends on
    ↓
MusicPlayer.Core
```

## Running the Project

From the server directory:

```bash
dotnet run --project MusicPlayer.API
```

Or from the API project directory:

```bash
cd MusicPlayer.API
dotnet run
```

Access the API:

- Swagger UI: `https://localhost:7246/swagger`
- API Endpoints: `https://localhost:7246/api/songs`
