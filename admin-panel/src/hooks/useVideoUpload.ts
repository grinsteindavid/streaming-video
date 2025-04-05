'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { videoService } from '@/services/video-service';
import { VideoFormData } from '@/types/upload';
import { videoKeys } from '@/hooks/useVideos';
import { CreateVideoRequest } from '@/types/api';

/**
 * Hook for handling video uploads with progress tracking
 */
export function useVideoUpload() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadState, setUploadState] = useState<'idle' | 'metadata' | 'video' | 'thumbnail' | 'completed' | 'error'>('idle');
  const queryClient = useQueryClient();

  // Create video metadata
  const createVideoMutation = useMutation({
    mutationFn: (data: CreateVideoRequest) => {
      setUploadState('metadata');
      return videoService.createVideo(data);
    },
    onError: () => setUploadState('error'),
  });

  // Upload video file
  const uploadVideoMutation = useMutation({
    mutationFn: ({ videoId, file }: { videoId: string; file: File }) => {
      setUploadState('video');
      setUploadProgress(0);
      return videoService.uploadVideoFile(videoId, file, (progress) => {
        setUploadProgress(progress);
      });
    },
    onError: () => setUploadState('error'),
  });

  // Upload thumbnail
  const uploadThumbnailMutation = useMutation({
    mutationFn: ({ videoId, file }: { videoId: string; file: File }) => {
      setUploadState('thumbnail');
      return videoService.uploadThumbnail(videoId, file);
    },
    onSuccess: () => {
      setUploadState('completed');
      // Invalidate queries to refresh the videos list
      queryClient.invalidateQueries({ queryKey: videoKeys.lists() });
    },
    onError: () => setUploadState('error'),
  });

  /**
   * Upload a video with its metadata and optional thumbnail
   */
  const uploadVideo = async (formData: VideoFormData): Promise<boolean> => {
    try {
      setUploadState('metadata');
      
      // 1. Create video metadata first
      const videoMetadata: CreateVideoRequest = {
        title: formData.title,
        description: formData.description,
        categories: formData.categories,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        status: formData.status,
        isPublic: formData.isPublic,
      };
      
      const video = await createVideoMutation.mutateAsync(videoMetadata);
      
      // 2. Upload the video file if available
      if (formData.videoFile) {
        await uploadVideoMutation.mutateAsync({
          videoId: video.id,
          file: formData.videoFile,
        });
      }
      
      // 3. Upload the thumbnail if available
      if (formData.thumbnail) {
        await uploadThumbnailMutation.mutateAsync({
          videoId: video.id,
          file: formData.thumbnail,
        });
      } else {
        // Even if there's no thumbnail, mark as completed
        setUploadState('completed');
        queryClient.invalidateQueries({ queryKey: videoKeys.lists() });
      }
      
      return true;
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadState('error');
      return false;
    }
  };

  return {
    uploadVideo,
    uploadProgress,
    uploadState,
    isUploading: uploadState !== 'idle' && uploadState !== 'completed' && uploadState !== 'error',
    isError: uploadState === 'error',
    isSuccess: uploadState === 'completed',
    reset: () => {
      setUploadState('idle');
      setUploadProgress(0);
    },
  };
}
