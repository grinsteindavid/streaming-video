'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useVideos } from '@/hooks/useVideos';
// VideoResponse type is used indirectly through the useVideos hook

export default function RecentUploads() {
  // Use React Query to fetch recent videos with small page size
  const { data, isLoading, error } = useVideos({ page: 1, pageSize: 5 });
  
  const recentUploads = data?.data || [];
  
  // Calculate video duration from seconds
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: 'numeric',
      hour12: true 
    }).format(date);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'ready':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'uploaded':
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  // Show loading state while data is being fetched
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Recent Uploads</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Loading recent uploads...</p>
        </div>
        <div className="animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="px-4 py-4 sm:px-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-16 w-24 rounded bg-gray-200 dark:bg-gray-600"></div>
                <div className="ml-4 flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // Show error state if API request failed
  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Recent Uploads</h3>
        </div>
        <div className="p-4">
          <div className="bg-red-50 dark:bg-red-900 p-4 rounded-lg text-red-800 dark:text-red-200">
            <p>Error loading recent uploads. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Recent Uploads</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Your most recently uploaded videos</p>
      </div>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {recentUploads.map((video) => (
          <li key={video.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150">
            <Link href={`/content/${video.id}`} className="block">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-16 w-24 rounded bg-gray-200 dark:bg-gray-600 overflow-hidden relative">
                  {video.thumbnail_url ? (
                    <Image 
                      src={video.thumbnail_url} 
                      alt={video.title} 
                      width={96}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-300 dark:bg-gray-700">
                      <span className="text-gray-500 dark:text-gray-400">No preview</span>
                    </div>
                  )}
                  <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
                    {formatDuration(video.duration)}
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{video.title}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Uploaded {formatDate(video.upload_date)}
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusBadgeClass(video.status)}`}>
                    {video.status.charAt(0).toUpperCase() + video.status.slice(1)}
                  </span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <div className="bg-gray-50 dark:bg-gray-700 px-4 py-4 sm:px-6 text-right">
        <Link 
          href="/content" 
          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
        >
          View all uploads →
        </Link>
      </div>
    </div>
  );
}
