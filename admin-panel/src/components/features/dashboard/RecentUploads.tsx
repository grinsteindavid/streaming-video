'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface VideoUpload {
  id: string;
  title: string;
  thumbnail: string;
  uploadDate: string;
  status: 'processing' | 'ready' | 'error';
  duration: string;
}

export default function RecentUploads() {
  const [recentUploads, setRecentUploads] = useState<VideoUpload[]>([
    {
      id: '1',
      title: 'Introduction to Web Development',
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
      uploadDate: '2025-04-01T14:35:00Z',
      status: 'ready',
      duration: '12:34'
    },
    {
      id: '2',
      title: 'Advanced React Hooks',
      thumbnail: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2',
      uploadDate: '2025-04-02T09:12:00Z',
      status: 'processing',
      duration: '45:21'
    },
    {
      id: '3',
      title: 'Building Responsive Layouts',
      thumbnail: 'https://images.unsplash.com/photo-1561883088-039e53143d73',
      uploadDate: '2025-04-03T16:48:00Z',
      status: 'ready',
      duration: '28:05'
    },
    {
      id: '4',
      title: 'Next.js for Enterprise',
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
      uploadDate: '2025-04-04T10:30:00Z',
      status: 'processing',
      duration: '59:59'
    }
  ]);

  // In a real app, we would fetch these uploads from an API
  useEffect(() => {
    // Simulate API fetch
    const fetchRecentUploads = async () => {
      // In real implementation: const response = await fetch('/api/videos/recent');
      // const data = await response.json();
      // setRecentUploads(data);
    };

    fetchRecentUploads();
  }, []);

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

  const getStatusBadgeClass = (status: VideoUpload['status']) => {
    switch (status) {
      case 'ready':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

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
                  <img 
                    src={video.thumbnail} 
                    alt={video.title} 
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
                    {video.duration}
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{video.title}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Uploaded {formatDate(video.uploadDate)}
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
