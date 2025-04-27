using Azure.Storage.Blobs;
using Azure.Storage.Sas;
using Microsoft.Extensions.Configuration;
using MusicPlayer.Core.Interfaces;

namespace MusicPlayer.Infrastructure.Services;

public class AzureBlobStorageService : IFileStorageService
{
  private readonly BlobServiceClient _blobServiceClient;
  private readonly string _containerName;
  private readonly string _connectionString;

  public AzureBlobStorageService(IConfiguration configuration)
  {
    _connectionString = configuration.GetConnectionString("AzureStorage")
        ?? throw new ArgumentNullException("AzureStorage connection string is not configured");
    _containerName = configuration["AzureStorage:ContainerName"]
        ?? throw new ArgumentNullException("AzureStorage container name is not configured");
    _blobServiceClient = new BlobServiceClient(_connectionString);
  }

  public async Task<Stream> GetFileAsync(string filePath)
  {
    var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
    var blobClient = containerClient.GetBlobClient(filePath);

    if (!await blobClient.ExistsAsync())
    {
      throw new FileNotFoundException($"File not found: {filePath}");
    }

    var response = await blobClient.DownloadAsync();
    return response.Value.Content;
  }

  public async Task<string> GetSasTokenAsync(string filePath, TimeSpan expiryTime)
  {
    var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
    var blobClient = containerClient.GetBlobClient(filePath);

    if (!await blobClient.ExistsAsync())
    {
      throw new FileNotFoundException($"File not found: {filePath}");
    }

    var sasBuilder = new BlobSasBuilder
    {
      BlobContainerName = _containerName,
      BlobName = filePath,
      Resource = "b",
      StartsOn = DateTimeOffset.UtcNow.AddMinutes(-5), // Allow for clock skew
      ExpiresOn = DateTimeOffset.UtcNow.Add(expiryTime)
    };

    sasBuilder.SetPermissions(BlobSasPermissions.Read);

    var sasToken = sasBuilder.ToSasQueryParameters(
        new Azure.Storage.StorageSharedKeyCredential(
            _blobServiceClient.AccountName,
            _connectionString.Split(';')
                .FirstOrDefault(x => x.StartsWith("AccountKey="))?
                .Split('=')[1] ?? throw new InvalidOperationException("AccountKey not found in connection string")
        )
    ).ToString();

    return sasToken;
  }

  public async Task<string> GetBlobUrlAsync(string filePath)
  {
    var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
    var blobClient = containerClient.GetBlobClient(filePath);

    if (!await blobClient.ExistsAsync())
    {
      throw new FileNotFoundException($"File not found: {filePath}");
    }

    return blobClient.Uri.ToString();
  }
}