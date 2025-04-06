'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Video } from '@/types/video';

interface SearchHistory {
  query: string;
  timestamp: number;
}

interface SearchContextType {
  searchQuery: string;
  searchResults: Video[];
  searchHistory: SearchHistory[];
  isSearching: boolean;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
  clearSearchHistory: () => void;
  removeFromSearchHistory: (query: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode; videos: Video[] }> = ({ 
  children, 
  videos 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Video[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Load search history from localStorage on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('searchHistory');
      if (savedHistory) {
        setSearchHistory(JSON.parse(savedHistory));
      }
    } catch (err) {
      console.error('Failed to load search history from localStorage', err);
    }
  }, []);

  // Save search history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    } catch (err) {
      console.error('Failed to save search history to localStorage', err);
    }
  }, [searchHistory]);

  // Update search results whenever searchQuery changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    // Simulate search delay for a more realistic experience
    const timer = setTimeout(() => {
      const results = videos.filter(video => {
        const query = searchQuery.toLowerCase();
        return (
          video.title.toLowerCase().includes(query) ||
          video.description.toLowerCase().includes(query) ||
          video.genre.some(g => g.toLowerCase().includes(query)) ||
          video.cast.some(c => c.toLowerCase().includes(query)) ||
          video.director.toLowerCase().includes(query)
        );
      });

      setSearchResults(results);
      setIsSearching(false);

      // Add to search history if it's a new search
      if (searchQuery.trim() && !searchHistory.some(h => h.query === searchQuery)) {
        setSearchHistory(prev => [
          { query: searchQuery, timestamp: Date.now() },
          ...prev
        ].slice(0, 10)); // Keep only the 10 most recent searches
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, videos, searchHistory]);

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
  };

  const removeFromSearchHistory = (query: string) => {
    setSearchHistory(prev => prev.filter(item => item.query !== query));
  };

  const value = {
    searchQuery,
    searchResults,
    searchHistory,
    isSearching,
    setSearchQuery,
    clearSearch,
    clearSearchHistory,
    removeFromSearchHistory
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
