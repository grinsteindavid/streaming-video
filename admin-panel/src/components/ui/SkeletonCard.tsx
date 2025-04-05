'use client';

/**
 * Skeleton placeholder card for loading states
 */
export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg animate-pulse">
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
  );
}
