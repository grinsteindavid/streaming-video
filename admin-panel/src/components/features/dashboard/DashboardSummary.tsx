'use client';

import { useDashboardSummary } from '@/hooks/useAnalytics';

interface SummaryCard {
  title: string;
  value: string | number;
  change: number;
  icon: string;
}

export default function DashboardSummary() {
  // Use React Query hook to fetch dashboard summary data
  const { data: summaryData, isLoading, error } = useDashboardSummary();
  
  // Transform API data into the format needed for rendering
  const summaryStats: SummaryCard[] = [
    {
      title: 'Total Videos',
      value: summaryData ? summaryData.totalVideos.toLocaleString() : '0',
      change: summaryData?.change.videos || 0,
      icon: '🎬'
    },
    {
      title: 'Total Views',
      value: summaryData ? formatViews(summaryData.totalViews) : '0',
      change: summaryData?.change.views || 0,
      icon: '👁️'
    },
    {
      title: 'Avg. Engagement',
      value: summaryData ? `${summaryData.averageEngagement}%` : '0%',
      change: summaryData?.change.engagement || 0,
      icon: '📊'
    },
    {
      title: 'Storage Used',
      value: summaryData ? formatStorage(summaryData.storageUsed) : '0 GB',
      change: summaryData?.change.storage || 0,
      icon: '💾'
    }
  ];
  
  // Helper function to format large numbers of views
  function formatViews(views: number): string {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  }
  
  // Helper function to format storage size
  function formatStorage(sizeInGB: number): string {
    if (sizeInGB >= 1000) {
      return `${(sizeInGB / 1000).toFixed(1)}TB`;
    }
    return `${sizeInGB.toFixed(1)}GB`;
  }
  
  // Show loading state while data is being fetched
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg animate-pulse">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded-md p-3 h-12 w-12"></div>
                <div className="ml-5 w-0 flex-1">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-4 sm:px-6">
              <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  // Show error state if API request failed
  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900 p-4 rounded-lg text-red-800 dark:text-red-200">
        <p>Error loading dashboard data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {summaryStats.map((stat, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-md p-3">
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    {stat.title}
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900 dark:text-white">
                      {stat.value}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-4 sm:px-6">
            <div className="text-sm">
              <span
                className={`font-medium ${stat.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
              >
                {stat.change >= 0 ? '↑' : '↓'} {Math.abs(stat.change)}%
              </span>{' '}
              <span className="text-gray-500 dark:text-gray-400">from last month</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
