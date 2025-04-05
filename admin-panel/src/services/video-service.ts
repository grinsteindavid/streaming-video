import { apiClient } from './api-client';
import {
  Video,
  VideoResponse,
  PaginatedResponse,
  PaginationParams,
  VideoFilterParams,
  CreateVideoRequest,
  UpdateVideoRequest,
  VideoUploadResponse
} from '@/types/api';

/**
 * Video service that handles all API requests for videos
 */
export const videoService = {
  /**
   * Get a paginated list of videos with optional filtering
   */
  async getVideos(
    { page = 1, pageSize = 10 }: PaginationParams,
    filters?: VideoFilterParams
  ): Promise<PaginatedResponse<VideoResponse>> {
    // Build query parameters for API
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('pageSize', pageSize.toString());
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((item: string) => queryParams.append(`${key}[]`, item));
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });
    }
    
    return apiClient.get<PaginatedResponse<VideoResponse>>(`/videos?${queryParams.toString()}`);
  },
  
  /**
   * Get a video by ID
   */
  async getVideo(id: string): Promise<VideoResponse> {
    return apiClient.get<VideoResponse>(`/videos/${id}`);
  },
  
  /**
   * Create a new video (metadata only)
   */
  async createVideo(data: CreateVideoRequest): Promise<Video> {
    return apiClient.post<CreateVideoRequest, Video>('/videos', data);
  },
  
  /**
   * Update a video's metadata
   */
  async updateVideo(id: string, data: UpdateVideoRequest): Promise<Video> {
    return apiClient.put<UpdateVideoRequest, Video>(`/videos/${id}`, data);
  },
  
  /**
   * Delete a video
   */
  async deleteVideo(id: string): Promise<{ success: boolean }> {
    return apiClient.delete<{ success: boolean }>(`/videos/${id}`);
  },
  
  /**
   * Upload a video file with progress tracking
   */
  async uploadVideoFile(
    videoId: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<VideoUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiClient.uploadFile<VideoUploadResponse>(`/videos/${videoId}/upload`, formData, onProgress);
  },
  
  /**
   * Upload a thumbnail for a video
   */
  async uploadThumbnail(
    videoId: string,
    file: File
  ): Promise<{ thumbnailUrl: string }> {
    const formData = new FormData();
    formData.append('thumbnail', file);
    
    return apiClient.uploadFile<{ thumbnailUrl: string }>(`/videos/${videoId}/thumbnail`, formData);
  }
};
