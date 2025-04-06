"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Button from './button';

interface HeroBannerItem {
  id: string;
  title: string;
  description: string;
  backgroundUrl: string;
  logoUrl?: string;
  videoUrl?: string;
  releaseYear?: number;
  duration?: string;
  rating?: string;
  genres?: string[];
}

interface HeroBannerProps {
  items: HeroBannerItem[];
  autoPlayInterval?: number; // in milliseconds
}

const HeroBanner = ({
  items,
  autoPlayInterval = 8000, // 8 seconds default
}: HeroBannerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Auto-play functionality
  useEffect(() => {
    if (items.length <= 1 || isHovered) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, autoPlayInterval);
    
    return () => clearInterval(interval);
  }, [items.length, autoPlayInterval, isHovered]);
  
  const currentItem = items[currentIndex];
  
  return (
    <section 
      className="relative h-[60vh] min-h-[500px] w-full overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image/Video */}
      <div className="absolute inset-0 z-0">
        {isPlaying && currentItem.videoUrl ? (
          <video 
            src={currentItem.videoUrl} 
            autoPlay 
            muted 
            className="w-full h-full object-cover"
          />
        ) : (
          <Image
            src={currentItem.backgroundUrl}
            alt={currentItem.title}
            fill
            priority
            className="object-cover"
          />
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-background-dark via-background-dark/70 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark to-transparent z-10" />
      </div>
      
      {/* Content */}
      <div className="relative z-20 container mx-auto h-full flex flex-col justify-center px-4 md:px-8">
        <div className="max-w-2xl">
          {currentItem.logoUrl ? (
            <div className="relative h-24 w-64 mb-4">
              <Image 
                src={currentItem.logoUrl} 
                alt={currentItem.title} 
                fill 
                className="object-contain object-left"
              />
            </div>
          ) : (
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              {currentItem.title}
            </h1>
          )}
          
          <div className="flex items-center text-sm text-text-secondary mb-4 flex-wrap gap-2">
            {currentItem.releaseYear && (
              <span>{currentItem.releaseYear}</span>
            )}
            
            {currentItem.rating && (
              <>
                <span className="w-1 h-1 rounded-full bg-text-secondary mx-2" />
                <span className="border border-text-secondary px-1 text-xs">
                  {currentItem.rating}
                </span>
              </>
            )}
            
            {currentItem.duration && (
              <>
                <span className="w-1 h-1 rounded-full bg-text-secondary mx-2" />
                <span>{currentItem.duration}</span>
              </>
            )}
            
            {currentItem.genres && currentItem.genres.length > 0 && (
              <>
                <span className="w-1 h-1 rounded-full bg-text-secondary mx-2" />
                <span>{currentItem.genres.join(', ')}</span>
              </>
            )}
          </div>
          
          <p className="text-text-secondary text-sm md:text-base mb-6 line-clamp-3 md:line-clamp-4">
            {currentItem.description}
          </p>
          
          <div className="flex space-x-4">
            <Button 
              variant="primary" 
              size="lg"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                </svg>
              }
              onClick={() => setIsPlaying(true)}
            >
              Watch Now
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                </svg>
              }
            >
              Add to List
            </Button>
          </div>
        </div>
      </div>
      
      {/* Carousel Controls */}
      {items.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
          {items.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? 'bg-primary-color w-4' : 'bg-text-secondary bg-opacity-50'}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default HeroBanner;
