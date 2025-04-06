"use client";

import { createContext, useState, useEffect, useContext, ReactNode } from 'react';

type VideoProgress = {
  id: string;
  progress: number;
  lastWatched: string;
};

type WatchlistItem = {
  id: string;
  dateAdded: string;
};

interface UserContextType {
  watchlist: WatchlistItem[];
  videoProgress: VideoProgress[];
  addToWatchlist: (id: string) => void;
  removeFromWatchlist: (id: string) => void;
  isInWatchlist: (id: string) => boolean;
  saveVideoProgress: (id: string, progress: number) => void;
  getVideoProgress: (id: string) => number;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [videoProgress, setVideoProgress] = useState<VideoProgress[]>([]);

  // Load saved data from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedWatchlist = localStorage.getItem('watchlist');
        const savedProgress = localStorage.getItem('videoProgress');
        
        if (savedWatchlist) {
          setWatchlist(JSON.parse(savedWatchlist));
        }
        
        if (savedProgress) {
          setVideoProgress(JSON.parse(savedProgress));
        }
      } catch (error) {
        console.error('Error loading user data from localStorage:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        localStorage.setItem('videoProgress', JSON.stringify(videoProgress));
      } catch (error) {
        console.error('Error saving user data to localStorage:', error);
      }
    }
  }, [watchlist, videoProgress]);

  // Add a video to watchlist
  const addToWatchlist = (id: string) => {
    if (!isInWatchlist(id)) {
      setWatchlist(prev => [...prev, { id, dateAdded: new Date().toISOString() }]);
    }
  };

  // Remove a video from watchlist
  const removeFromWatchlist = (id: string) => {
    setWatchlist(prev => prev.filter(item => item.id !== id));
  };

  // Check if a video is in watchlist
  const isInWatchlist = (id: string) => {
    return watchlist.some(item => item.id === id);
  };

  // Save video progress
  const saveVideoProgress = (id: string, progress: number) => {
    setVideoProgress(prev => {
      const existingIndex = prev.findIndex(item => item.id === id);
      
      if (existingIndex >= 0) {
        // Update existing entry
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          progress,
          lastWatched: new Date().toISOString(),
        };
        return updated;
      } else {
        // Add new entry
        return [
          ...prev,
          { id, progress, lastWatched: new Date().toISOString() },
        ];
      }
    });
  };

  // Get video progress
  const getVideoProgress = (id: string): number => {
    const video = videoProgress.find(item => item.id === id);
    return video ? video.progress : 0;
  };

  return (
    <UserContext.Provider
      value={{
        watchlist,
        videoProgress,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        saveVideoProgress,
        getVideoProgress,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  
  return context;
}
