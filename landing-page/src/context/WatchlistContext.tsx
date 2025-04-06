'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

type WatchlistContextType = {
  watchlist: string[];
  isInWatchlist: (videoId: string) => boolean;
  addToWatchlist: (videoId: string) => void;
  removeFromWatchlist: (videoId: string) => void;
  toggleWatchlist: (videoId: string) => void;
  isLoaded: boolean;
};

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const WatchlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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
  const isInWatchlist = (videoId: string): boolean => {
    return watchlist.includes(videoId);
  };

  // Add a video to the watchlist
  const addToWatchlist = (videoId: string): void => {
    try {
      if (!isInWatchlist(videoId)) {
        const updatedWatchlist = [...watchlist, videoId];
        localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
        setWatchlist(updatedWatchlist);
      }
    } catch (err) {
      console.error('Failed to add to watchlist', err);
    }
  };

  // Remove a video from the watchlist
  const removeFromWatchlist = (videoId: string): void => {
    try {
      if (isInWatchlist(videoId)) {
        const updatedWatchlist = watchlist.filter(id => id !== videoId);
        localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
        setWatchlist(updatedWatchlist);
      }
    } catch (err) {
      console.error('Failed to remove from watchlist', err);
    }
  };

  // Toggle a video in the watchlist
  const toggleWatchlist = (videoId: string): void => {
    if (isInWatchlist(videoId)) {
      removeFromWatchlist(videoId);
    } else {
      addToWatchlist(videoId);
    }
  };

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        isInWatchlist,
        addToWatchlist,
        removeFromWatchlist,
        toggleWatchlist,
        isLoaded
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = (): WatchlistContextType => {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};
