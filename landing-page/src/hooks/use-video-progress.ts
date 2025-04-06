"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@/context/user-context';

interface UseVideoProgressOptions {
  autoSaveInterval?: number; // in milliseconds
  onProgressChange?: (progress: number) => void;
}

/**
 * Custom hook for managing video playback progress
 * 
 * @param videoId Unique identifier for the video
 * @param options Configuration options
 * @returns VideoProgress control methods and state
 */
export function useVideoProgress(videoId: string, options?: UseVideoProgressOptions) {
  const { getVideoProgress, saveVideoProgress } = useUser();
  const [progress, setProgress] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const autoSaveInterval = options?.autoSaveInterval || 5000; // Default: save every 5 seconds
  
  // Load saved progress on mount
  useEffect(() => {
    const savedProgress = getVideoProgress(videoId);
    setProgress(savedProgress);
    setIsLoaded(true);
  }, [videoId, getVideoProgress]);
  
  // Set up automatic progress saving
  useEffect(() => {
    if (!isLoaded) return;
    
    const saveInterval = setInterval(() => {
      if (progress > 0) {
        saveVideoProgress(videoId, progress);
      }
    }, autoSaveInterval);
    
    return () => clearInterval(saveInterval);
  }, [videoId, progress, saveVideoProgress, autoSaveInterval, isLoaded]);
  
  // Update progress
  const updateProgress = (newProgress: number) => {
    setProgress(newProgress);
    options?.onProgressChange?.(newProgress);
  };
  
  // Save current progress immediately
  const saveProgress = () => {
    if (progress > 0) {
      saveVideoProgress(videoId, progress);
    }
  };
  
  // Handle video completion
  const completeVideo = () => {
    saveVideoProgress(videoId, 100);
    setProgress(100);
    options?.onProgressChange?.(100);
  };
  
  // Reset progress
  const resetProgress = () => {
    saveVideoProgress(videoId, 0);
    setProgress(0);
    options?.onProgressChange?.(0);
  };
  
  return {
    progress,
    updateProgress,
    saveProgress,
    completeVideo,
    resetProgress,
    isLoaded,
  };
}
