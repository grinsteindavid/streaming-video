'use client';

import { useState } from 'react';
import { FilterOptions, SortOption } from './SearchFilters';
import SearchFilters from './SearchFilters';
import ContentList from './ContentList';
import Link from 'next/link';

interface VideoContent {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  uploadDate: string;
  duration: string;
  categories: string[];
  tags: string[];
  status: 'published' | 'draft' | 'archived';
  views: number;
}

export default function ContentLibrary() {
  // Using the initial mock data for content demonstration
  const [videos] = useState<VideoContent[]>([
    {
      id: '1',
      title: 'Getting Started with React',
      description: 'Learn the basics of React and build your first component',
      thumbnail: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2',
      uploadDate: '2025-03-15T10:00:00Z',
      duration: '12:34',
      categories: ['Programming', 'Web Development'],
      tags: ['react', 'javascript', 'frontend'],
      status: 'published',
      views: 12500
    },
    {
      id: '2',
      title: 'Advanced CSS Techniques',
      description: 'Explore advanced CSS features and techniques for modern web development',
      thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159',
      uploadDate: '2025-03-18T14:30:00Z',
      duration: '28:45',
      categories: ['Web Development', 'Design'],
      tags: ['css', 'web design', 'frontend'],
      status: 'published',
      views: 9800
    },
    {
      id: '3',
      title: 'Building RESTful APIs',
      description: 'Learn how to design and implement RESTful APIs for your applications',
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
      uploadDate: '2025-03-20T09:15:00Z',
      duration: '45:12',
      categories: ['Backend', 'API Development'],
      tags: ['api', 'rest', 'backend'],
      status: 'draft',
      views: 0
    },
    {
      id: '4',
      title: 'Introduction to TypeScript',
      description: 'Get started with TypeScript and learn how it improves JavaScript development',
      thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8',
      uploadDate: '2025-03-25T16:20:00Z',
      duration: '33:18',
      categories: ['Programming', 'Web Development'],
      tags: ['typescript', 'javascript', 'programming'],
      status: 'published',
      views: 7600
    },
    {
      id: '5',
      title: 'Database Design Fundamentals',
      description: 'Learn about database design principles and best practices',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
      uploadDate: '2025-03-28T11:45:00Z',
      duration: '52:40',
      categories: ['Database', 'Backend'],
      tags: ['database', 'sql', 'design'],
      status: 'archived',
      views: 15200
    },
    {
      id: '6',
      title: 'UX Design Principles',
      description: 'Explore key principles of user experience design for digital products',
      thumbnail: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2',
      uploadDate: '2025-04-01T13:10:00Z',
      duration: '41:56',
      categories: ['Design', 'UX'],
      tags: ['ux', 'design', 'user experience'],
      status: 'published',
      views: 8900
    }
  ]);
  
  // State for search, filters, and sorting for the new components
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
  
  // No need to extract categories here as it's handled by the SearchFilters component
  
  // Event handlers for search, filter, and sort actions
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  const handleFilter = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };
  
  const handleSort = (newSortOption: SortOption) => {
    setSortOption(newSortOption);
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
        searchQuery={searchQuery}
        filters={filters}
        sortOption={sortOption}
      />
      
      {/* Stats summary at the bottom */}
      <div className="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Content Overview</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Videos</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{videos.length}</p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Published</p>
            <p className="text-2xl font-semibold text-green-600 dark:text-green-400">
              {videos.filter(v => v.status === 'published').length}
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Drafts</p>
            <p className="text-2xl font-semibold text-yellow-600 dark:text-yellow-400">
              {videos.filter(v => v.status === 'draft').length}
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Views</p>
            <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {videos.reduce((sum, video) => sum + video.views, 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
