using MediatR;
using Microsoft.AspNetCore.Http;
using System;
using VideoStreamingApi.Application.DTOs;

namespace VideoStreamingApi.Application.Commands.Videos
{
    /// <summary>
    /// Command to upload a subtitle file for a video
    /// </summary>
    public class UploadSubtitleCommand : IRequest<VideoDto>
    {
        /// <summary>
        /// ID of the video to add subtitles for
        /// </summary>
        public Guid VideoId { get; set; }
        
        /// <summary>
        /// Language code for the subtitle (e.g., "en-US", "es", "fr")
        /// </summary>
        public string Language { get; set; } = string.Empty;
        
        /// <summary>
        /// The subtitle file to upload
        /// </summary>
        public IFormFile SubtitleFile { get; set; } = null!;
    }
}
