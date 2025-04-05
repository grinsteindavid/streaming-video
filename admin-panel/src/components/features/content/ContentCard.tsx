'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ContentCardProps {
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

export default function ContentCard({
  id,
  title,
  thumbnail,
  views,
  likes,
  uploadDate,
  duration,
  status,
  categories
}: ContentCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatViews = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="relative group">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden bg-gray-200 dark:bg-gray-700">
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover"
          />
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-1.5 py-0.5 rounded text-xs">
            {duration}
          </div>
        </div>

        {/* Hover overlay with actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-full p-2 mx-1 hover:bg-blue-500 hover:text-white transition-colors duration-200"
            aria-label="Play"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-full p-2 mx-1 hover:bg-blue-500 hover:text-white transition-colors duration-200"
            aria-label="Edit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
        </div>

        {/* Status badge */}
        <div className={`absolute top-2 left-2 px-2 py-0.5 rounded text-xs ${status === 'published' ? 'bg-green-500' : 'bg-yellow-500'} text-white`}>
          {status === 'published' ? 'Published' : 'Draft'}
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-md font-medium text-gray-900 dark:text-white line-clamp-2">{title}</h3>
          <div className="relative">
            <button 
              onClick={toggleMenu}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
            
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 ring-1 ring-black ring-opacity-5">
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                  Edit
                </button>
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                  Duplicate
                </button>
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                  {status === 'published' ? 'Unpublish' : 'Publish'}
                </button>
                <button className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
          <span>{formatDate(uploadDate)}</span>
          <span className="mx-1">•</span>
          <span>{formatViews(views)} views</span>
          <span className="mx-1">•</span>
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
            {formatViews(likes)}
          </span>
        </div>
        
        {categories.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {categories.slice(0, 3).map((category, index) => (
              <span key={index} className="inline-block px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded">
                {category}
              </span>
            ))}
            {categories.length > 3 && (
              <span className="inline-block px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded">
                +{categories.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
