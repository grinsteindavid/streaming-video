'use client';

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { videoService } from '@/services/video-service';
import {
  VideoResponse,
  PaginatedResponse,
  PaginationParams,
  VideoFilterParams,
  CreateVideoRequest,
  UpdateVideoRequest,
} from '@/types/api';

// Define query keys for better organization
export const videoKeys = {
  all: ['videos'] as const,
  lists: () => [...videoKeys.all, 'list'] as const,
  list: (params: PaginationParams, filters?: VideoFilterParams) => 
    [...videoKeys.lists(), params, filters] as const,
  details: () => [...videoKeys.all, 'detail'] as const,
  detail: (id: string) => [...videoKeys.details(), id] as const,
};

/**
 * Hook to fetch a paginated list of videos with optional filtering
 */
export function useVideos(
  params: PaginationParams,
  filters?: VideoFilterParams,
  options?: UseQueryOptions<PaginatedResponse<VideoResponse>>
) {
  return useQuery({
    queryKey: videoKeys.list(params, filters),
    queryFn: () => videoService.getVideos(params, filters),
    ...options,
  });
}

/**
 * Hook to fetch a single video by ID
 */
export function useVideo(id: string) {
  return useQuery({
    queryKey: videoKeys.detail(id),
    queryFn: () => videoService.getVideo(id),
    enabled: !!id, // Only run the query if we have an ID
  });
}

/**
 * Hook to create a new video
 */
export function useCreateVideo() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateVideoRequest) => videoService.createVideo(data),
    onSuccess: () => {
      // Invalidate and refetch videos list queries
      queryClient.invalidateQueries({ queryKey: videoKeys.lists() });
    },
  });
}

/**
 * Hook to update a video
 */
export function useUpdateVideo() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateVideoRequest }) => 
      videoService.updateVideo(id, data),
    onSuccess: (_, variables) => {
      // Invalidate the specific video query
      queryClient.invalidateQueries({ queryKey: videoKeys.detail(variables.id) });
      // Also invalidate the list to reflect the changes
      queryClient.invalidateQueries({ queryKey: videoKeys.lists() });
    },
  });
}

/**
 * Hook to delete a video
 */
export function useDeleteVideo() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => videoService.deleteVideo(id),
    onSuccess: (_, id) => {
      // Invalidate and refetch videos list queries
      queryClient.invalidateQueries({ queryKey: videoKeys.lists() });
      // Remove the video from the cache
      queryClient.removeQueries({ queryKey: videoKeys.detail(id) });
    },
  });
}
