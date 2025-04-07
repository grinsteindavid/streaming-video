using Microsoft.EntityFrameworkCore;
using VideoStreamingApi.Domain.Entities;

namespace VideoStreamingApi.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Video> Videos { get; set; }
        public DbSet<VideoFile> VideoFiles { get; set; }
        public DbSet<ViewStat> ViewStats { get; set; }
        public DbSet<Rating> Ratings { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Video entity configuration
            modelBuilder.Entity<Video>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(255);
                entity.Property(e => e.Description).HasMaxLength(2000);
                entity.Property(e => e.Tags).HasConversion(
                    v => string.Join(',', v),
                    v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList()
                );
            });

            // VideoFile entity configuration
            modelBuilder.Entity<VideoFile>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(e => e.Video)
                      .WithMany(v => v.VideoFiles)
                      .HasForeignKey(e => e.VideoId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // ViewStat entity configuration
            modelBuilder.Entity<ViewStat>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(e => e.Video)
                      .WithMany(v => v.ViewStats)
                      .HasForeignKey(e => e.VideoId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Rating entity configuration
            modelBuilder.Entity<Rating>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(e => e.Video)
                      .WithMany(v => v.Ratings)
                      .HasForeignKey(e => e.VideoId)
                      .OnDelete(DeleteBehavior.Cascade);
                entity.Property(e => e.RatingValue).IsRequired();
            });
        }
    }
}
