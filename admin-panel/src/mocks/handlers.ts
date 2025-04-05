import { http, HttpResponse, delay } from 'msw';
import { mockVideos } from './video-data';
import { CreateVideoRequest, UpdateVideoRequest, VideoUploadResponse, VideoResponse } from '@/types/api';

// Base API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const handlers = [
  // GET /videos - List videos with pagination and filtering
  http.get(`${API_URL}/videos`, async ({ request }) => {
    // Parse query parameters for pagination and filtering
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
    const search = url.searchParams.get('search');
    const status = url.searchParams.get('status');
    const isPublic = url.searchParams.get('isPublic');
    
    // Apply filters
    let filteredVideos = [...mockVideos];
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredVideos = filteredVideos.filter(video => {
        return (
          video.title.toLowerCase().includes(searchLower) ||
          video.description.toLowerCase().includes(searchLower) ||
          video.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      });
    }
    
    if (status) {
      filteredVideos = filteredVideos.filter(video => video.status === status);
    }
    
    if (isPublic !== null) {
      const isPublicBool = isPublic === 'true';
      filteredVideos = filteredVideos.filter(video => video.isPublic === isPublicBool);
    }
    
    // Get categories from query params (could be multiple)
    const categories = url.searchParams.getAll('categories[]');
    if (categories.length > 0) {
      filteredVideos = filteredVideos.filter(video => {
        return categories.some(category => video.categories.includes(category));
      });
    }
    
    // Get tags from query params (could be multiple)
    const tags = url.searchParams.getAll('tags[]');
    if (tags.length > 0) {
      filteredVideos = filteredVideos.filter(video => {
        return tags.some(tag => video.tags.includes(tag));
      });
    }
    
    // Pagination
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedVideos = filteredVideos.slice(start, end);
    
    // Simulate network delay
    await delay(500);
    
    return HttpResponse.json({
      data: paginatedVideos,
      total: filteredVideos.length,
      page,
      pageSize,
      totalPages: Math.ceil(filteredVideos.length / pageSize)
    });
  }),
  
  // GET /videos/:id - Get video by ID
  http.get(`${API_URL}/videos/:id`, async ({ params }) => {
    const { id } = params;
    const video = mockVideos.find(v => v.id === id);
    
    if (!video) {
      return new HttpResponse(null, { status: 404, statusText: 'Video not found' });
    }
    
    await delay(300); // Simulate network delay
    return HttpResponse.json(video);
  }),
  
  // POST /videos - Create a new video
  http.post(`${API_URL}/videos`, async ({ request }) => {
    const data = await request.json() as CreateVideoRequest;
    
    // Generate a new ID
    const id = `video-${mockVideos.length + 1}`;
    
    const newVideo: VideoResponse = {
      id,
      title: data.title,
      description: data.description,
      duration: 0, // Will be updated after processing
      upload_date: new Date().toISOString(),
      status: 'uploaded', // Using the proper VideoStatus type
      thumbnail_url: null, // Will be updated after processing
      tags: data.tags,
      categories: data.categories,
      isPublic: data.isPublic,
      stats: {
        views: 0,
        average_rating: 0,
        total_ratings: 0,
        total_watch_time: 0
      }
    };
    
    // Add to mock data
    mockVideos.unshift(newVideo);
    
    await delay(500); // Simulate network delay
    return HttpResponse.json(newVideo);
  }),
  
  // PUT /videos/:id - Update video metadata
  http.put(`${API_URL}/videos/:id`, async ({ params, request }) => {
    const { id } = params;
    const data = await request.json() as UpdateVideoRequest;
    
    const videoIndex = mockVideos.findIndex(v => v.id === id);
    
    if (videoIndex === -1) {
      return new HttpResponse(null, { status: 404, statusText: 'Video not found' });
    }
    
    // Update the video
    const updatedVideo = {
      ...mockVideos[videoIndex],
      ...data
    };
    
    mockVideos[videoIndex] = updatedVideo;
    
    await delay(300); // Simulate network delay
    return HttpResponse.json(updatedVideo);
  }),
  
  // DELETE /videos/:id - Delete a video
  http.delete(`${API_URL}/videos/:id`, async ({ params }) => {
    const { id } = params;
    
    const videoIndex = mockVideos.findIndex(v => v.id === id);
    
    if (videoIndex === -1) {
      return new HttpResponse(null, { status: 404, statusText: 'Video not found' });
    }
    
    // Remove from mock data
    mockVideos.splice(videoIndex, 1);
    
    await delay(300); // Simulate network delay
    return HttpResponse.json({ success: true });
  }),
  
  // POST /videos/:id/upload - Upload a video file
  http.post(`${API_URL}/videos/:id/upload`, async ({ params }) => {
    const { id } = params;
    
    // Simulate a delay for a large file upload
    await delay(3000);
    
    const response: VideoUploadResponse = {
      id: id as string,
      upload_url: `https://example.com/videos/${id}`,
      success: true
    };
    
    return HttpResponse.json(response);
  }),
  
  // POST /videos/:id/thumbnail - Upload a thumbnail
  http.post(`${API_URL}/videos/:id/thumbnail`, async ({ params }) => {
    const { id } = params;
    
    await delay(1000); // Simulate network delay
    
    // Update the mock video with a thumbnail URL
    const videoIndex = mockVideos.findIndex(v => v.id === id);
    if (videoIndex !== -1) {
      mockVideos[videoIndex].thumbnail_url = `https://example.com/thumbnails/${id}`;
    }
    
    return HttpResponse.json({ thumbnailUrl: `https://example.com/thumbnails/${id}` });
  }),
  
  // GET /analytics/videos/:id - Get video performance metrics
  http.get(`${API_URL}/analytics/videos/:id`, async ({ params }) => {
    const { id } = params;
    const video = mockVideos.find(v => v.id === id);
    
    if (!video || !video.stats) {
      return new HttpResponse(null, { status: 404, statusText: 'Video not found' });
    }
    
    await delay(300); // Simulate network delay
    return HttpResponse.json(video.stats);
  }),
  
  // POST /analytics/videos/:id/view - Record a video view
  http.post(`${API_URL}/analytics/videos/:id/view`, async ({ params }) => {
    const { id } = params;
    const videoIndex = mockVideos.findIndex(v => v.id === id);
    
    if (videoIndex === -1) {
      return new HttpResponse(null, { status: 404, statusText: 'Video not found' });
    }
    
    // Update view count
    if (mockVideos[videoIndex].stats) {
      mockVideos[videoIndex].stats.views += 1;
    }
    
    await delay(200); // Simulate network delay
    return HttpResponse.json({ success: true });
  }),
];
