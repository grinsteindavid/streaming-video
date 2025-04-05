'use client';

import { useState, useMemo } from 'react';
import { FilterOptions, SortOption } from './SearchFilters';
import SearchFilters from './SearchFilters';
import ContentList from './ContentList';
import Link from 'next/link';
import { useVideos } from '@/hooks/useVideos';
import { VideoFilterParams, VideoStatus } from '@/types/api';


export default function ContentLibrary() {
  // State for pagination, search, filters, and sorting
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    uploadDateRange: {
      from: '',
      to: ''
    },
    status: ['published', 'draft', 'archived']
  });
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  
  // Convert UI filters to API filter params
  const apiFilters = useMemo<VideoFilterParams>(() => {
    const filterParams: VideoFilterParams = {};
    
    // Add search query
    if (searchQuery) {
      filterParams.search = searchQuery;
    }
    
    // Convert statuses from FilterOptions to VideoStatus
    if (filters.status && filters.status.length > 0) {
      // Just use the first status for simplicity
      filterParams.status = filters.status[0] as VideoStatus;
    }
    
    // Add categories
    if (filters.categories && filters.categories.length > 0) {
      filterParams.categories = filters.categories;
    }
    
    // Add date range
    if (filters.uploadDateRange?.from) {
      filterParams.startDate = filters.uploadDateRange.from;
    }
    if (filters.uploadDateRange?.to) {
      filterParams.endDate = filters.uploadDateRange.to;
    }
    
    return filterParams;
  }, [searchQuery, filters]);
  
  // Add sort parameters
  const sortParams = useMemo(() => {
    switch (sortOption) {
      case 'newest':
        return { sort: 'upload_date', order: 'desc' };
      case 'oldest':
        return { sort: 'upload_date', order: 'asc' };
      case 'popular':
        return { sort: 'views', order: 'desc' };
      case 'name_asc':
        return { sort: 'title', order: 'asc' };
      case 'name_desc':
        return { sort: 'title', order: 'desc' };
      default:
        return { sort: 'upload_date', order: 'desc' };
    }
  }, [sortOption]);
  
  // Use React Query hook to fetch videos with pagination and filtering
  const { data, isLoading, error } = useVideos(
    { page: currentPage, pageSize },
    { ...apiFilters, ...sortParams }
  );
  
  // Event handlers for search, filter, and sort actions
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search
  };
  
  const handleFilter = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page on new filter
  };
  
  const handleSort = (newSortOption: SortOption) => {
    setSortOption(newSortOption);
  };
  
  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      {/* Action buttons panel */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href="/upload"
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Upload New
        </Link>
        
        <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg flex items-center gap-2 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
          </svg>
          Batch Actions
        </button>
        
        <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg flex items-center gap-2 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Export Data
        </button>
      </div>
      
      {/* Advanced search and filters */}
      <SearchFilters 
        onSearch={handleSearch}
        onFilter={handleFilter}
        onSort={handleSort}
      />
      
      {/* Enhanced content list with modern UI */}
      <ContentList 
        videos={data?.data || []}
        isLoading={isLoading}
        error={error}
        searchQuery={searchQuery}
        filters={filters}
        sortOption={sortOption}
        currentPage={currentPage}
        totalPages={data?.totalPages || 1}
        onPageChange={handlePageChange}
      />
      
      {/* Stats summary at the bottom */}
      <div className="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Content Overview</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Videos</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {isLoading ? '...' : data?.total || 0}
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Published</p>
            <p className="text-2xl font-semibold text-green-600 dark:text-green-400">
              {isLoading ? '...' : data?.data.filter(v => v.status === 'published').length || 0}
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Drafts</p>
            <p className="text-2xl font-semibold text-yellow-600 dark:text-yellow-400">
              {isLoading ? '...' : data?.data.filter(v => v.status === 'draft').length || 0}
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Views</p>
            <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {isLoading ? '...' : data?.data.reduce((sum, video) => sum + (video.stats?.views || 0), 0).toLocaleString() || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
