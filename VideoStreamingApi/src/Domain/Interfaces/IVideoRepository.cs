using VideoStreamingApi.Domain.Entities;

namespace VideoStreamingApi.Domain.Interfaces
{
    public interface IVideoRepository : IRepository<Video>
    {
        Task<IEnumerable<Video>> GetAllWithPaginationAsync(int pageNumber, int pageSize);
        Task<IEnumerable<Video>> GetByTagsAsync(List<string> tags);
        Task<int> GetTotalCountAsync();
        Task<Video?> GetVideoWithDetailsAsync(Guid id);
    }
}
