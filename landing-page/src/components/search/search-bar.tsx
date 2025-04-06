"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface SearchResult {
  id: string;
  title: string;
  type: 'movie' | 'show' | 'documentary';
  posterUrl: string;
}

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  // Load search history from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedHistory = localStorage.getItem('searchHistory');
      if (savedHistory) {
        try {
          setSearchHistory(JSON.parse(savedHistory));
        } catch (e) {
          console.error('Failed to parse search history:', e);
        }
      }
    }
  }, []);
  
  // Save search history to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && searchHistory.length > 0) {
      localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }
  }, [searchHistory]);
  
  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Mock search function
  // In a real app, this would be calling your API
  const searchContent = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    
    setIsLoading(true);
    setIsOpen(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock search results
    const mockResults: SearchResult[] = [
      {
        id: 'result1',
        title: `Cosmic ${searchQuery}`,
        type: 'movie',
        posterUrl: 'https://picsum.photos/100/150?random=1'
      },
      {
        id: 'result2',
        title: `${searchQuery} Adventures`,
        type: 'show',
        posterUrl: 'https://picsum.photos/100/150?random=2'
      },
      {
        id: 'result3',
        title: `World of ${searchQuery}`,
        type: 'documentary',
        posterUrl: 'https://picsum.photos/100/150?random=3'
      },
    ];
    
    setResults(mockResults);
    setIsLoading(false);
  };
  
  // Handle search input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    searchContent(value);
  };
  
  // Add to search history and navigate to result
  const handleResultClick = (result: SearchResult) => {
    if (query.trim()) {
      // Add to history if not already present
      if (!searchHistory.includes(query)) {
        // Keep only the last 5 searches
        const newHistory = [query, ...searchHistory.slice(0, 4)];
        setSearchHistory(newHistory);
      }
    }
    
    setIsOpen(false);
    router.push(`/video/${result.id}`);
  };
  
  // Clear search history
  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };
  
  return (
    <div className="relative w-full max-w-md" ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search movies, shows, genres..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.trim() && setIsOpen(true)}
          className="w-full bg-background-light bg-opacity-50 text-text-primary placeholder:text-text-secondary rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-primary-color"
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21 21L15.5 15.5M15.5 15.5C17.0913 13.9087 18 11.7565 18 9.5C18 7.24349 17.0913 5.09124 15.5 3.5C13.9087 1.90876 11.7565 1 9.5 1C7.24349 1 5.09124 1.90876 3.5 3.5C1.90876 5.09124 1 7.24349 1 9.5C1 11.7565 1.90876 13.9087 3.5 15.5C5.09124 17.0913 7.24349 18 9.5 18C11.7565 18 13.9087 17.0913 15.5 15.5Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        
        {query && (
          <button 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary"
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
      
      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-background-light rounded-md shadow-lg z-50 overflow-hidden">
          {isLoading ? (
            <div className="p-4 text-center text-text-secondary">
              <div className="animate-spin inline-block w-6 h-6 border-2 border-current border-t-transparent rounded-full mb-2"></div>
              <p>Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <div>
              <div className="p-3 border-b border-background-dark">
                <h3 className="text-sm font-medium text-text-primary">Search Results</h3>
              </div>
              <ul>
                {results.map((result) => (
                  <li key={result.id} className="border-b border-background-dark last:border-none">
                    <button
                      className="w-full flex items-center p-3 hover:bg-card-hover transition-colors"
                      onClick={() => handleResultClick(result)}
                    >
                      <div className="w-10 h-15 relative mr-3 flex-shrink-0 rounded overflow-hidden">
                        <Image 
                          src={result.posterUrl} 
                          alt={result.title} 
                          fill
                          sizes="100px"
                          className="object-cover" 
                          priority={false}
                        />
                      </div>
                      <div className="text-left">
                        <h4 className="text-text-primary font-medium">{result.title}</h4>
                        <p className="text-text-secondary text-xs capitalize">{result.type}</p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : query ? (
            <div className="p-4 text-center text-text-secondary">
              <p>No results found for &ldquo;{query}&rdquo;</p>
            </div>
          ) : searchHistory.length > 0 ? (
            <div>
              <div className="p-3 border-b border-background-dark flex justify-between items-center">
                <h3 className="text-sm font-medium text-text-primary">Recent Searches</h3>
                <button 
                  className="text-xs text-primary-color hover:text-primary-color/80"
                  onClick={clearHistory}
                >
                  Clear All
                </button>
              </div>
              <ul>
                {searchHistory.map((term, index) => (
                  <li key={index} className="border-b border-background-dark last:border-none">
                    <button
                      className="w-full flex items-center p-3 hover:bg-card-hover transition-colors"
                      onClick={() => {
                        setQuery(term);
                        searchContent(term);
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-3 text-text-secondary">
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                      </svg>
                      <span className="text-text-primary">{term}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
