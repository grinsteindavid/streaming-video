import { useQuery } from '@tanstack/react-query';
import { getVideos, getVideoById, getFeaturedVideos, getVideosByCategory } from '@/services/videoService';
import { Video, VideoCategory } from '@/types/video';

// Hook for fetching all videos with filtering
export const useVideos = ({
  page = 1,
  limit = 20,
  genre,
  search,
  sortBy = 'releaseDate',
  order = 'desc',
  enabled = true
}: {
  page?: number;
  limit?: number;
  genre?: string;
  search?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  enabled?: boolean;
} = {}) => {
  return useQuery({
    queryKey: ['videos', { page, limit, genre, search, sortBy, order }],
    queryFn: () => getVideos({ page, limit, genre, search, sortBy, order }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled
  });
};

// Hook for fetching a single video by ID
export const useVideo = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ['video', id],
    queryFn: () => getVideoById(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!id && enabled
  });
};

// Hook for fetching featured videos
export const useFeaturedVideos = (enabled = true) => {
  return useQuery({
    queryKey: ['featuredVideos'],
    queryFn: () => getFeaturedVideos(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled
  });
};

// Hook for fetching videos by category
export const useVideoCategories = (enabled = true) => {
  return useQuery({
    queryKey: ['videoCategories'],
    queryFn: () => getVideosByCategory(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled
  });
};
