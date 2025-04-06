'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Video, VideoProgress } from '@/types/video';

interface VideoContextType {
  videos: Video[];
  featuredVideos: Video[];
  videoProgress: VideoProgress[];
  isLoading: boolean;
  error: Error | null;
  updateVideoProgress: (videoId: string, progress: number) => void;
  getVideoById: (id: string) => Video | undefined;
  getVideoProgressById: (id: string) => number;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const VideoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [featuredVideos, setFeaturedVideos] = useState<Video[]>([]);
  const [videoProgress, setVideoProgress] = useState<VideoProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load video progress from localStorage on mount
  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem('videoProgress');
      if (savedProgress) {
        setVideoProgress(JSON.parse(savedProgress));
      }
    } catch (err) {
      console.error('Failed to load video progress from localStorage', err);
    }
  }, []);

  // Save video progress to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('videoProgress', JSON.stringify(videoProgress));
    } catch (err) {
      console.error('Failed to save video progress to localStorage', err);
    }
  }, [videoProgress]);

  // Update video progress
  const updateVideoProgress = (videoId: string, progress: number) => {
    setVideoProgress(prevProgress => {
      const existingProgressIndex = prevProgress.findIndex(p => p.videoId === videoId);
      
      if (existingProgressIndex >= 0) {
        // Update existing progress
        const updatedProgress = [...prevProgress];
        updatedProgress[existingProgressIndex] = {
          videoId,
          progress,
          timestamp: Date.now()
        };
        return updatedProgress;
      } else {
        // Add new progress
        return [...prevProgress, {
          videoId,
          progress,
          timestamp: Date.now()
        }];
      }
    });
  };

  // Get video by ID
  const getVideoById = (id: string) => {
    return videos.find(video => video.id === id);
  };

  // Get video progress by ID
  const getVideoProgressById = (id: string) => {
    const progress = videoProgress.find(p => p.videoId === id);
    return progress ? progress.progress : 0;
  };

  const value = {
    videos,
    featuredVideos,
    videoProgress,
    isLoading,
    error,
    updateVideoProgress,
    getVideoById,
    getVideoProgressById
  };

  return (
    <VideoContext.Provider value={value}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideo = (): VideoContextType => {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error('useVideo must be used within a VideoProvider');
  }
  return context;
};
