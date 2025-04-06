import React, { useState } from 'react';
import Image from 'next/image';

interface CardProps {
  id: string;
  title: string;
  posterUrl: string;
  aspectRatio?: '16:9' | '2:3' | '1:1';
  size?: 'sm' | 'md' | 'lg';
  progress?: number; // 0-100
  quality?: 'HD' | '4K' | 'SD';
  isNew?: boolean;
  onClick?: () => void;
  showPreview?: boolean;
  previewUrl?: string;
}

const Card = ({
  id,
  title,
  posterUrl,
  aspectRatio = '16:9',
  size = 'md',
  progress = 0,
  quality,
  isNew = false,
  onClick,
  showPreview = true,
  previewUrl,
}: CardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  
  const aspectRatioStyles = {
    '16:9': 'aspect-video',
    '2:3': 'aspect-[2/3]',
    '1:1': 'aspect-square',
  };
  
  const sizeStyles = {
    sm: 'w-32 sm:w-40',
    md: 'w-48 sm:w-56',
    lg: 'w-64 sm:w-72',
  };
  
  return (
    <div
      className={`relative ${sizeStyles[size]} overflow-hidden rounded-md transition-transform duration-300 cursor-pointer`}
      style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className={`${aspectRatioStyles[aspectRatio]} relative bg-background-light`}>
        {!isImageLoaded && (
          <div className="absolute inset-0 bg-background-light animate-pulse" />
        )}
        
        <Image
          src={isHovered && previewUrl ? previewUrl : posterUrl}
          alt={title}
          fill
          className={`object-cover transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsImageLoaded(true)}
          sizes={`(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw`}
        />
        
        {/* Progress bar for partially watched content */}
        {progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-background-light bg-opacity-50">
            <div 
              className="h-full bg-primary-color" 
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
        
        {/* New badge */}
        {isNew && (
          <div className="absolute top-2 right-2 bg-accent-color text-white text-xs font-bold px-1.5 py-0.5 rounded">
            NEW
          </div>
        )}
        
        {/* Quality badge */}
        {quality && (
          <div className="absolute top-2 left-2 bg-background-dark bg-opacity-75 text-text-primary text-xs px-1.5 py-0.5 rounded">
            {quality}
          </div>
        )}
        
        {/* Hover overlay with more info and quick actions */}
        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/60 to-transparent flex flex-col justify-end p-3">
            <h3 className="text-sm font-semibold text-text-primary line-clamp-2">{title}</h3>
            <div className="flex mt-2 space-x-2">
              <button 
                className="bg-white text-background-dark rounded-full w-8 h-8 flex items-center justify-center hover:bg-primary-color hover:text-white transition-colors"
                aria-label="Play"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                </svg>
              </button>
              <button 
                className="bg-background-light text-text-primary rounded-full w-8 h-8 flex items-center justify-center hover:bg-primary-color hover:text-white transition-colors"
                aria-label="Add to watchlist"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
