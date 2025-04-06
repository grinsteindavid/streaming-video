'use client';

import { useState, useEffect, useCallback } from 'react';
import { Video } from '@/types/video';

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load watchlist from localStorage
  useEffect(() => {
    try {
      const savedWatchlist = localStorage.getItem('watchlist');
      if (savedWatchlist) {
        setWatchlist(JSON.parse(savedWatchlist));
      } else {
        // Initialize empty watchlist if none exists
        localStorage.setItem('watchlist', JSON.stringify([]));
      }
    } catch (err) {
      console.error('Failed to load watchlist from localStorage', err);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Check if a video is in the watchlist
  const isInWatchlist = useCallback((videoId: string): boolean => {
    return watchlist.includes(videoId);
  }, [watchlist]);

  // Add a video to the watchlist
  const addToWatchlist = useCallback((videoId: string): void => {
    try {
      if (!isInWatchlist(videoId)) {
        const updatedWatchlist = [...watchlist, videoId];
        localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
        setWatchlist(updatedWatchlist);
      }
    } catch (err) {
      console.error('Failed to add to watchlist', err);
    }
  }, [watchlist, isInWatchlist]);

  // Remove a video from the watchlist
  const removeFromWatchlist = useCallback((videoId: string): void => {
    try {
      if (isInWatchlist(videoId)) {
        const updatedWatchlist = watchlist.filter(id => id !== videoId);
        localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
        setWatchlist(updatedWatchlist);
      }
    } catch (err) {
      console.error('Failed to remove from watchlist', err);
    }
  }, [watchlist, isInWatchlist]);

  // Toggle a video in the watchlist
  const toggleWatchlist = useCallback((videoId: string): void => {
    if (isInWatchlist(videoId)) {
      removeFromWatchlist(videoId);
    } else {
      addToWatchlist(videoId);
    }
  }, [isInWatchlist, removeFromWatchlist, addToWatchlist]);

  return {
    watchlist,
    isInWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatchlist,
    isLoaded
  };
};
