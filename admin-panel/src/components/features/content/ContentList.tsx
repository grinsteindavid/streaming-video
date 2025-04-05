'use client';

import { useMemo } from 'react';
import ContentCard from './ContentCard';
import { VideoResponse } from '@/types/api';

// Interface for pagination props
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

interface ContentListProps extends PaginationProps {
  videos: VideoResponse[];
  isLoading: boolean;
  error: Error | null;
}

export default function ContentList({ 
  videos, 
  isLoading, 
  error, 
  currentPage, 
  totalPages, 
  onPageChange 
}: ContentListProps) {
  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  // Helper function to format duration from seconds
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Pagination UI controls
  const renderPagination = useMemo(() => {
    const pages = [];
    const displayedPages = 5; // Number of page buttons to show
    
    let startPage = Math.max(1, currentPage - Math.floor(displayedPages / 2));
    const endPage = Math.min(totalPages, startPage + displayedPages - 1);
    
    // Adjust if we're near the end
    if (endPage - startPage + 1 < displayedPages) {
      startPage = Math.max(1, endPage - displayedPages + 1);
    }
    
    // Previous button
    pages.push(
      <button 
        key="prev" 
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-md text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      >
        Previous
      </button>
    );
    
    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            currentPage === i 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
          } transition-colors`}
        >
          {i}
        </button>
      );
    }
    
    // Next button
    pages.push(
      <button 
        key="next" 
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-md text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      >
        Next
      </button>
    );
    
    return (
      <div className="flex justify-center gap-2 mt-6">
        {pages}
      </div>
    );
  }, [currentPage, totalPages, onPageChange]);

  // Show error state if there's an API error
  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="text-center py-10">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Error Loading Content</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">{error.message || 'Failed to load videos. Please try again later.'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      {isLoading ? (
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="h-80 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      ) : videos.length === 0 ? (
        <div className="p-6 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No videos found</h3>
          <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map(video => (
              <ContentCard
                key={video.id}
                id={video.id}
                title={video.title}
                thumbnail={video.thumbnail_url || '/placeholder-image.jpg'}
                viewCount={video.stats?.views || 0}
                uploadDate={formatDate(video.upload_date)}
                duration={video.duration ? formatDuration(video.duration) : '0:00'}
                status={video.status}
              />
            ))}
          </div>
          
          {/* Pagination controls */}
          {totalPages > 1 && renderPagination}
        </div>
      )}
    </div>
  );
}
