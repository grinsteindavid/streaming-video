'use client';

import { useState, useEffect } from 'react';

interface SummaryCard {
  title: string;
  value: string | number;
  change: number;
  icon: string;
}

export default function DashboardSummary() {
  const [summaryStats, setSummaryStats] = useState<SummaryCard[]>([
    {
      title: 'Total Videos',
      value: '1,254',
      change: 12.5,
      icon: '🎬'
    },
    {
      title: 'Total Views',
      value: '2.4M',
      change: 8.2,
      icon: '👁️'
    },
    {
      title: 'Avg. Engagement',
      value: '68%',
      change: -2.1,
      icon: '📊'
    },
    {
      title: 'Storage Used',
      value: '1.8TB',
      change: 4.3,
      icon: '💾'
    }
  ]);

  // In a real app, we would fetch these stats from an API
  useEffect(() => {
    // Simulate API fetch
    const fetchStats = async () => {
      // In real implementation: const response = await fetch('/api/dashboard/stats');
      // const data = await response.json();
      // setSummaryStats(data);
    };

    fetchStats();
  }, []);

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
