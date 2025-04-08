using Microsoft.EntityFrameworkCore;
using VideoStreamingApi.Domain.Entities;
using VideoStreamingApi.Domain.Interfaces;
using VideoStreamingApi.Infrastructure.Data;

namespace VideoStreamingApi.Infrastructure.Repositories
{
    public class VideoRepository : Repository<Video>, IVideoRepository
    {
        public VideoRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Video>> GetAllWithPaginationAsync(int pageNumber, int pageSize)
        {
            return await _dbSet
                .OrderByDescending(v => v.Timestamp)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<IEnumerable<Video>> GetByTagsAsync(List<string> tags)
        {
            return await _dbSet
                .Where(v => tags.Any(tag => v.Tags.Contains(tag)))
                .OrderByDescending(v => v.Timestamp)
                .ToListAsync();
        }

        public async Task<int> GetTotalCountAsync()
        {
            return await _dbSet.CountAsync();
        }

        public async Task<Video?> GetVideoWithDetailsAsync(Guid id)
        {
            return await _dbSet
                .Include(v => v.VideoFiles)
                .Include(v => v.ViewStats)
                .Include(v => v.Ratings)
                .FirstOrDefaultAsync(v => v.Id == id);
        }
    }
}
