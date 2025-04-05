'use client';

import { useState } from 'react';

interface SearchFiltersProps {
  onSearch: (query: string) => void;
  onFilter: (filters: FilterOptions) => void;
  onSort: (sortOption: SortOption) => void;
}

export interface FilterOptions {
  categories: string[];
  uploadDateRange: {
    from: string;
    to: string;
  };
  status: string[];
}

export type SortOption = 'newest' | 'oldest' | 'popular' | 'name_asc' | 'name_desc' | 'views-high' | 'views-low' | 'likes-high' | 'likes-low';

export default function SearchFilters({ onSearch, onFilter, onSort }: SearchFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string[]>(['published', 'draft']);
  const [sortOption, setSortOption] = useState<SortOption>('newest');

  const availableCategories = [
    'Programming',
    'Web Development',
    'Mobile Development',
    'Data Science',
    'Machine Learning',
    'DevOps',
    'Design',
    'Business',
    'Marketing',
    'Productivity'
  ];

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(prev => {
      if (prev.includes(status)) {
        return prev.filter(s => s !== status);
      } else {
        return [...prev, status];
      }
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value as SortOption;
    setSortOption(newSort);
    onSort(newSort);
  };

  const applyFilters = () => {
    onFilter({
      categories: selectedCategories,
      uploadDateRange: {
        from: dateFrom,
        to: dateTo
      },
      status: selectedStatus
    });
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setDateFrom('');
    setDateTo('');
    setSelectedStatus(['published', 'draft']);
    setSortOption('newest');
    
    onFilter({
      categories: [],
      uploadDateRange: {
        from: '',
        to: ''
      },
      status: ['published', 'draft']
    });
    onSort('newest');
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden mb-6">
      <div className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search input */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search videos..."
              className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
              onClick={handleSearch}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          {/* Sort dropdown */}
          <div className="w-full sm:w-48">
            <select
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              value={sortOption}
              onChange={handleSortChange}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="views-high">Most Views</option>
              <option value="views-low">Least Views</option>
              <option value="likes-high">Most Likes</option>
              <option value="likes-low">Least Likes</option>
            </select>
          </div>
          
          {/* Toggle filters button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-200 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
            Filters
            {(selectedCategories.length > 0 || dateFrom || dateTo || selectedStatus.length !== 2) && (
              <span className="inline-flex justify-center items-center w-5 h-5 bg-blue-500 text-white text-xs rounded-full">
                !
              </span>
            )}
          </button>
        </div>
        
        {/* Expandable filters */}
        {showFilters && (
          <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Categories */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {availableCategories.map((category) => (
                    <button
                      key={category}
                      className={`px-3 py-1 text-sm rounded-full ${selectedCategories.includes(category) 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                      onClick={() => handleCategoryChange(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Upload date range */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Upload Date Range</h3>
                <div className="flex gap-2 sm:flex-row">
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 dark:text-gray-400">From</label>
                    <input
                      type="date"
                      className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 dark:text-gray-400">To</label>
                    <input
                      type="date"
                      className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              {/* Status */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</h3>
                <div className="flex gap-3">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                      checked={selectedStatus.includes('published')}
                      onChange={() => handleStatusChange('published')}
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Published</span>
                  </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                      checked={selectedStatus.includes('draft')}
                      onChange={() => handleStatusChange('draft')}
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Draft</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Reset
              </button>
              <button
                onClick={applyFilters}
                className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
