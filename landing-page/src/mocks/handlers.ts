import { http, HttpResponse } from 'msw';
import { mockVideos, mockCategories } from './mockData';
import { Video } from '@/types/video';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const handlers = [
  // Get all videos with filtering
  http.get(`${API_URL}/videos`, ({ request }) => {
    const url = new URL(request.url);
    const featured = url.searchParams.get('featured') === 'true';
    const genre = url.searchParams.get('genre');
    const search = url.searchParams.get('search');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const sortBy = url.searchParams.get('sortBy') || 'releaseDate';
    const order = url.searchParams.get('order') || 'desc';
    
    let filteredVideos = [...mockVideos];
    
    // Filter by featured
    if (featured) {
      filteredVideos = filteredVideos.filter(video => video.isFeatured);
    }
    
    // Filter by genre
    if (genre) {
      filteredVideos = filteredVideos.filter(video => 
        video.genre.some((g: string) => g.toLowerCase() === genre.toLowerCase())
      );
    }
    
    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase();
      filteredVideos = filteredVideos.filter(video => 
        video.title.toLowerCase().includes(searchLower) ||
        video.description.toLowerCase().includes(searchLower) ||
        video.genre.some((g: string) => g.toLowerCase().includes(searchLower)) ||
        video.cast.some((c: string) => c.toLowerCase().includes(searchLower)) ||
        video.director.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort videos
    filteredVideos.sort((a, b) => {
      if (sortBy === 'releaseDate') {
        const dateA = new Date(a.releaseDate).getTime();
        const dateB = new Date(b.releaseDate).getTime();
        return order === 'asc' ? dateA - dateB : dateB - dateA;
      }
      
      if (sortBy === 'rating') {
        return order === 'asc' ? a.rating - b.rating : b.rating - a.rating;
      }
      
      if (sortBy === 'title') {
        return order === 'asc' 
          ? a.title.localeCompare(b.title) 
          : b.title.localeCompare(a.title);
      }
      
      return 0;
    });
    
    // Paginate results
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedVideos = filteredVideos.slice(startIndex, endIndex);
    
    return HttpResponse.json(paginatedVideos);
  }),
  
  // Get video by ID
  http.get(`${API_URL}/videos/:id`, ({ params }) => {
    const { id } = params;
    const video = mockVideos.find((v: Video) => v.id === id);
    
    if (!video) {
      return new HttpResponse(JSON.stringify({ message: 'Video not found' }), {
        status: 404,
      });
    }
    
    return HttpResponse.json(video);
  }),
  
  // Get video categories
  http.get(`${API_URL}/videos/categories`, () => {
    return HttpResponse.json(mockCategories);
  }),
  
  // Get video stream (mock response with a delay)
  http.get(`${API_URL}/videos/:id/stream`, () => {
    return new HttpResponse('MOCK_HLS_CONTENT', {
      status: 200,
      headers: {
        'Content-Type': 'application/x-mpegURL'
      }
    });
  }),
  
  // Get video subtitles
  http.get(`${API_URL}/videos/:id/subtitles`, ({ params }) => {
    const { id } = params;
    const video = mockVideos.find((v: Video) => v.id === id);
    
    if (!video || !video.subtitles) {
      return new HttpResponse(JSON.stringify({ message: 'Subtitles not found' }), {
        status: 404,
      });
    }
    
    return HttpResponse.json(video.subtitles);
  }),
  
  // Get video subtitles by language
  http.get(`${API_URL}/videos/:id/subtitles/:language`, ({ params }) => {
    const { id, language } = params;
    const video = mockVideos.find((v: Video) => v.id === id);
    
    if (!video || !video.subtitles) {
      return new HttpResponse(JSON.stringify({ message: 'Subtitles not found' }), {
        status: 404,
      });
    }
    
    const subtitle = video.subtitles.find((s: { language: string }) => s.language === language);
    
    if (!subtitle) {
      return new HttpResponse(JSON.stringify({ message: `Subtitles for ${language} not found` }), {
        status: 404,
      });
    }
    
    return HttpResponse.json(subtitle);
  }),
];
