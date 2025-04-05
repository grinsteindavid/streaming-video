'use client';

import { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<'7days' | '30days' | '90days' | 'year'>('30days');
  const [selectedMetric, setSelectedMetric] = useState<'views' | 'engagement' | 'subscribers'>('views');

  // Mock data for views over time
  const viewsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].slice(0, timeRange === '7days' ? 7 : timeRange === '30days' ? 10 : 12),
    datasets: [
      {
        label: 'Views',
        data: timeRange === '7days' 
          ? [3500, 4200, 3800, 5000, 4600, 5200, 6100]
          : timeRange === '30days'
            ? [3500, 4200, 3800, 5000, 4600, 5200, 6100, 5800, 6300, 7000]
            : [3500, 4200, 3800, 5000, 4600, 5200, 6100, 5800, 6300, 7000, 7500, 8200],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3
      }
    ]
  };

  // Mock data for engagement metrics
  const engagementData = {
    labels: ['Likes', 'Comments', 'Shares', 'Saves', 'Avg. Watch Time'],
    datasets: [
      {
        label: 'Engagement',
        data: [6500, 4200, 2800, 3400, 5100],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)', // blue
          'rgba(34, 197, 94, 0.7)',  // green
          'rgba(239, 68, 68, 0.7)',   // red
          'rgba(168, 85, 247, 0.7)',  // purple
          'rgba(234, 179, 8, 0.7)'    // yellow
        ],
        borderWidth: 1
      }
    ]
  };
  
  // Mock data for content categories performance
  const categoriesData = {
    labels: ['Programming', 'Web Dev', 'Mobile Dev', 'Data Science', 'UI/UX', 'DevOps'],
    datasets: [
      {
        label: 'Views by Category',
        data: [12000, 19000, 8000, 15000, 10000, 6000],
        backgroundColor: 'rgba(59, 130, 246, 0.7)'
      }
    ]
  };

  // Mock data for Top Performing Content
  const topContent = [
    { id: '1', title: 'Getting Started with React', views: 12500, engagement: 8.7 },
    { id: '2', title: 'Advanced CSS Techniques', views: 9800, engagement: 7.5 },
    { id: '4', title: 'Introduction to TypeScript', views: 7600, engagement: 6.9 },
    { id: '5', title: 'Database Design Fundamentals', views: 15200, engagement: 9.2 },
    { id: '6', title: 'UX Design Principles', views: 8900, engagement: 7.1 }
  ];

  // Chart options
  const lineOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Views Over Time',
        color: 'rgb(107, 114, 128)',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(107, 114, 128, 0.1)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  const barOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Content Performance by Category',
        color: 'rgb(107, 114, 128)',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  // Mock data for audience overview
  const audienceData = {
    labels: ['Desktop', 'Mobile', 'Tablet'],
    datasets: [
      {
        label: 'Audience by Device',
        data: [45, 40, 15],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(34, 197, 94, 0.7)',
          'rgba(168, 85, 247, 0.7)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(168, 85, 247, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Summary statistics
  const summaryStats = [
    { label: 'Total Views', value: '483.2K', change: '+12.5%', positive: true },
    { label: 'Avg. Engagement', value: '7.8', change: '+3.2%', positive: true },
    { label: 'Total Watch Time', value: '28.5K hrs', change: '+8.7%', positive: true },
    { label: 'Subscribers', value: '42.7K', change: '-2.1%', positive: false }
  ];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Performance Overview</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Monitor key metrics about your content</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <select
            className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
            <option value="year">Last year</option>
          </select>
          
          <select
            className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value as any)}
          >
            <option value="views">Views</option>
            <option value="engagement">Engagement</option>
            <option value="subscribers">Subscribers</option>
          </select>
          
          <button className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm">
            Export Data
          </button>
        </div>
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryStats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
            <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
            <p className={`mt-1 text-sm ${stat.positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {stat.change} {stat.positive ? '↑' : '↓'}
            </p>
          </div>
        ))}
      </div>
      
      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views Over Time */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <Line data={viewsData} options={lineOptions} />
        </div>
        
        {/* Content Performance by Category */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <Bar data={categoriesData} options={barOptions} />
        </div>
      </div>
      
      {/* Engagement and Audience */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement Metrics */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Engagement Breakdown</h3>
          <div className="h-64">
            <Bar data={engagementData} />
          </div>
        </div>
        
        {/* Audience by Device */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Audience by Device</h3>
          <div className="flex justify-center h-64">
            <Doughnut data={audienceData} />
          </div>
        </div>
      </div>
      
      {/* Top Performing Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Top Performing Content</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Content with the highest engagement and views</p>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Content Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Views
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Engagement Score
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {topContent.map((content) => (
                  <tr key={content.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {content.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {content.views.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <span className="mr-2">{content.engagement}</span>
                        <div className="relative w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                          <div 
                            className="absolute top-0 left-0 h-2 bg-blue-500 rounded-full" 
                            style={{ width: `${(content.engagement / 10) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Insights Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Key Insights</h3>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <svg className="h-5 w-5 text-green-600 dark:text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-4">
              <h4 className="text-md font-medium text-gray-900 dark:text-white">Growth in Mobile Viewership</h4>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Mobile views have increased by 24% in the last 30 days. Consider optimizing more content for mobile viewers.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-4">
              <h4 className="text-md font-medium text-gray-900 dark:text-white">Programming Content Performance</h4>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Content in the "Programming" category has the highest average watch time. Consider creating more in-depth programming tutorials.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
              <svg className="h-5 w-5 text-red-600 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-4">
              <h4 className="text-md font-medium text-gray-900 dark:text-white">Declining Subscriber Growth</h4>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">New subscriber rate has decreased by 2.1%. Consider implementing subscriber engagement campaigns or special content.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
