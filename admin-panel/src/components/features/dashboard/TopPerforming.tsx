'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface TopVideo {
  id: string;
  title: string;
  thumbnail: string;
  views: number;
  engagement: number;
  trend: 'up' | 'down' | 'stable';
}

export default function TopPerforming() {
  const [topVideos, setTopVideos] = useState<TopVideo[]>([
    {
      id: '101',
      title: 'Machine Learning Fundamentals',
      thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485',
      views: 124500,
      engagement: 92,
      trend: 'up'
    },
    {
      id: '102',
      title: 'Cloud Computing Explained',
      thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8',
      views: 98200,
      engagement: 86,
      trend: 'stable'
    },
    {
      id: '103',
      title: 'Database Design Best Practices',
      thumbnail: 'https://images.unsplash.com/photo-1603322327561-7c9bc6be700d',
      views: 87600,
      engagement: 78,
      trend: 'up'
    },
    {
      id: '104',
      title: 'Mobile App Development Workshop',
      thumbnail: 'https://images.unsplash.com/photo-1551650975-87deedd944c3',
      views: 76400,
      engagement: 81,
      trend: 'down'
    }
  ]);

  // In a real app, we would fetch these stats from an API
  useEffect(() => {
    // Simulate API fetch
    const fetchTopVideos = async () => {
      // In real implementation: const response = await fetch('/api/videos/top-performing');
      // const data = await response.json();
      // setTopVideos(data);
    };

    fetchTopVideos();
  }, []);

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return (views / 1000000).toFixed(1) + 'M';
    } else if (views >= 1000) {
      return (views / 1000).toFixed(1) + 'K';
    }
    return views.toString();
  };

  const getTrendIcon = (trend: TopVideo['trend']) => {
    switch (trend) {
      case 'up':
        return <span className="text-green-600 dark:text-green-400">↑</span>;
      case 'down':
        return <span className="text-red-600 dark:text-red-400">↓</span>;
      case 'stable':
        return <span className="text-gray-600 dark:text-gray-400">→</span>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Top Performing Content</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Videos with highest engagement and view counts</p>
      </div>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {topVideos.map((video) => (
          <li key={video.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150">
            <Link href={`/analytics/video/${video.id}`} className="block">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-16 w-24 rounded bg-gray-200 dark:bg-gray-600 overflow-hidden">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title} 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex justify-between">
                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">{video.title}</div>
                    <div className="ml-2 flex items-center">
                      {getTrendIcon(video.trend)}
                    </div>
                  </div>
                  <div className="mt-2 flex justify-between">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatViews(video.views)} views
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${video.engagement}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{video.engagement}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <div className="bg-gray-50 dark:bg-gray-700 px-4 py-4 sm:px-6 text-right">
        <Link 
          href="/analytics" 
          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
        >
          View detailed analytics →
        </Link>
      </div>
    </div>
  );
}
