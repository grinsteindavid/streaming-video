import { Video, VideoCategory } from '@/types/video';

// Base API URL from environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Get all videos with optional filtering
export const getVideos = async ({
  page = 1,
  limit = 20,
  genre,
  search,
  sortBy = 'releaseDate',
  order = 'desc'
}: {
  page?: number;
  limit?: number;
  genre?: string;
  search?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
} = {}) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    sortBy,
    order
  });

  if (genre) params.append('genre', genre);
  if (search) params.append('search', search);

  const response = await fetch(`${API_URL}/videos?${params.toString()}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch videos');
  }
  
  return response.json();
};

// Get video by ID
export const getVideoById = async (id: string): Promise<Video> => {
  const response = await fetch(`${API_URL}/videos/${id}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch video');
  }
  
  return response.json();
};

// Get featured videos
export const getFeaturedVideos = async (): Promise<Video[]> => {
  const response = await fetch(`${API_URL}/videos?featured=true`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch featured videos');
  }
  
  return response.json();
};

// Get videos by category
export const getVideosByCategory = async (): Promise<VideoCategory[]> => {
  const response = await fetch(`${API_URL}/videos/categories`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch video categories');
  }
  
  return response.json();
};

// Get video stream URL
export const getVideoStreamUrl = (id: string): string => {
  return `${API_URL}/videos/${id}/stream`;
};

// Get video subtitles
export const getVideoSubtitles = async (id: string, language?: string) => {
  const url = language 
    ? `${API_URL}/videos/${id}/subtitles/${language}` 
    : `${API_URL}/videos/${id}/subtitles`;
    
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch subtitles');
  }
  
  return response.json();
};
