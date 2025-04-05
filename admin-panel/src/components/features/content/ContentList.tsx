'use client';

import { useState, useEffect } from 'react';
import ContentCard from './ContentCard';
import { FilterOptions, SortOption } from './SearchFilters';

// Mock data interface
interface VideoContent {
  id: string;
  title: string;
  thumbnail: string;
  views: number;
  likes: number;
  uploadDate: string;
  duration: string;
  status: 'published' | 'draft';
  categories: string[];
}

interface ContentListProps {
  searchQuery: string;
  filters: FilterOptions;
  sortOption: SortOption;
}

export default function ContentList({ searchQuery, filters, sortOption }: ContentListProps) {
  const [videos, setVideos] = useState<VideoContent[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<VideoContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data fetching
  useEffect(() => {
    const fetchVideos = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // const response = await fetch('/api/videos');
        // const data = await response.json();
        // setVideos(data);
        
        // Mock data
        setTimeout(() => {
          const mockVideos: VideoContent[] = Array.from({ length: 12 }, (_, i) => ({
            id: `video-${i + 1}`,
            title: i % 3 === 0 
              ? 'Getting Started with Next.js and React - Build a Modern Web Application'
              : i % 3 === 1 
                ? 'Advanced TypeScript Features Every Developer Should Know'
                : 'Building Responsive UIs with Tailwind CSS',
            thumbnail: `https://picsum.photos/seed/${i + 1}/800/450`,
            views: Math.floor(Math.random() * 500000),
            likes: Math.floor(Math.random() * 50000),
            uploadDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
            duration: `${Math.floor(Math.random() * 10) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
            status: i % 5 === 0 ? 'draft' : 'published',
            categories: [
              ['Web Development', 'Programming', 'Next.js', 'React'][Math.floor(Math.random() * 4)],
              ['Design', 'UI/UX', 'CSS', 'Tailwind'][Math.floor(Math.random() * 4)],
              ['DevOps', 'Productivity', 'Mobile Development'][Math.floor(Math.random() * 3)]
            ].filter((_, index) => index < Math.floor(Math.random() * 3) + 1)
          }));
          
          setVideos(mockVideos);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching videos:', error);
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Apply search, filters, and sorting
  useEffect(() => {
    if (videos.length === 0) return;

    let result = [...videos];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(video => 
        video.title.toLowerCase().includes(query) ||
        video.categories.some(category => category.toLowerCase().includes(query))
      );
    }

    // Apply category filters
    if (filters.categories.length > 0) {
      result = result.filter(video => 
        video.categories.some(category => filters.categories.includes(category))
      );
    }

    // Apply date range filters
    if (filters.uploadDateRange.from) {
      const fromDate = new Date(filters.uploadDateRange.from);
      result = result.filter(video => new Date(video.uploadDate) >= fromDate);
    }

    if (filters.uploadDateRange.to) {
      const toDate = new Date(filters.uploadDateRange.to);
      toDate.setHours(23, 59, 59, 999); // End of day
      result = result.filter(video => new Date(video.uploadDate) <= toDate);
    }

    // Apply status filters
    if (filters.status.length > 0 && filters.status.length < 2) {
      result = result.filter(video => filters.status.includes(video.status));
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortOption) {
        case 'newest':
          return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
        case 'oldest':
          return new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime();
        case 'views-high':
          return b.views - a.views;
        case 'views-low':
          return a.views - b.views;
        case 'likes-high':
          return b.likes - a.likes;
        case 'likes-low':
          return a.likes - b.likes;
        default:
          return 0;
      }
    });

    setFilteredVideos(result);
  }, [videos, searchQuery, filters, sortOption]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden animate-pulse">
            <div className="aspect-video bg-gray-300 dark:bg-gray-600"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredVideos.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
        <svg
          className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No videos found</h3>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Try adjusting your search or filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredVideos.map((video) => (
        <ContentCard
          key={video.id}
          id={video.id}
          title={video.title}
          thumbnail={video.thumbnail}
          views={video.views}
          likes={video.likes}
          uploadDate={video.uploadDate}
          duration={video.duration}
          status={video.status}
          categories={video.categories}
        />
      ))}
    </div>
  );
}
