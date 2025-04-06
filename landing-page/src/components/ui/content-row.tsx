"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from './card';

interface ContentItem {
  id: string;
  title: string;
  posterUrl: string;
  previewUrl?: string;
  progress?: number;
  quality?: 'HD' | '4K' | 'SD';
  isNew?: boolean;
}

interface ContentRowProps {
  title: string;
  items: ContentItem[];
  aspectRatio?: '16:9' | '2:3' | '1:1';
  seeMoreHref?: string;
  onItemClick?: (id: string) => void;
}

const ContentRow: React.FC<ContentRowProps> = ({
  title,
  items,
  aspectRatio = '16:9',
  seeMoreHref,
  onItemClick,
}) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Check if we can scroll in either direction
  const checkScrollability = () => {
    if (!rowRef.current) return;
    
    setCanScrollLeft(rowRef.current.scrollLeft > 0);
    setCanScrollRight(
      rowRef.current.scrollLeft + rowRef.current.offsetWidth < rowRef.current.scrollWidth
    );
  };
  
  // Initialize and set up listeners
  useEffect(() => {
    const rowElement = rowRef.current;
    if (rowElement) {
      checkScrollability();
      rowElement.addEventListener('scroll', checkScrollability);
      window.addEventListener('resize', checkScrollability);
    }
    
    return () => {
      if (rowElement) {
        rowElement.removeEventListener('scroll', checkScrollability);
        window.removeEventListener('resize', checkScrollability);
      }
    };
  }, []);
  
  // Check scrollability when items change
  useEffect(() => {
    checkScrollability();
  }, [items]);
  
  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!rowRef.current) return;
    
    setIsDragging(true);
    setStartX(e.pageX - rowRef.current.offsetLeft);
    setScrollLeft(rowRef.current.scrollLeft);
  };
  
  // Handle mouse move for dragging
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !rowRef.current) return;
    
    const x = e.pageX - rowRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    rowRef.current.scrollLeft = scrollLeft - walk;
  };
  
  // Handle mouse up/leave to stop dragging
  const handleDragEnd = () => {
    setIsDragging(false);
  };
  
  // Scroll left
  const scrollRowLeft = () => {
    if (!rowRef.current) return;
    
    rowRef.current.scrollBy({
      left: -rowRef.current.offsetWidth * 0.8,
      behavior: 'smooth',
    });
  };
  
  // Scroll right
  const scrollRowRight = () => {
    if (!rowRef.current) return;
    
    rowRef.current.scrollBy({
      left: rowRef.current.offsetWidth * 0.8,
      behavior: 'smooth',
    });
  };
  
  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-text-primary">{title}</h2>
          
          {seeMoreHref && (
            <a 
              href={seeMoreHref} 
              className="text-text-secondary hover:text-primary-color transition-colors text-sm"
            >
              See all
            </a>
          )}
        </div>
        
        {/* Content Row with horizontal scrolling */}
        <div className="relative group">
          {/* Left scroll button */}
          {canScrollLeft && (
            <button
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-background-dark bg-opacity-90 rounded-full p-1 text-text-primary shadow-md opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
              onClick={scrollRowLeft}
              disabled={!canScrollLeft}
              aria-label="Scroll left"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
              </svg>
            </button>
          )}
          
          {/* Scrollable content */}
          <div
            ref={rowRef}
            className={`flex space-x-4 overflow-x-auto pb-4 scrollbar-hide ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
          >
            {items.map((item) => (
              <Card
                key={item.id}
                id={item.id}
                title={item.title}
                posterUrl={item.posterUrl}
                previewUrl={item.previewUrl}
                aspectRatio={aspectRatio}
                progress={item.progress}
                quality={item.quality}
                isNew={item.isNew}
                onClick={() => {
                  if (onItemClick) {
                    onItemClick(item.id);
                  } else {
                    // Default behavior is to navigate to the video details page
                    router.push(`/video/${item.id}`);
                  }
                }}
              />
            ))}
          </div>
          
          {/* Right scroll button */}
          {canScrollRight && (
            <button
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-background-dark bg-opacity-90 rounded-full p-1 text-text-primary shadow-md opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
              onClick={scrollRowRight}
              disabled={!canScrollRight}
              aria-label="Scroll right"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
              </svg>
            </button>
          )}
          
          {/* Gradient indicators for scrollability */}
          {canScrollLeft && (
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background-dark to-transparent pointer-events-none" />
          )}
          
          {canScrollRight && (
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background-dark to-transparent pointer-events-none" />
          )}
        </div>
      </div>
    </section>
  );
};

export default ContentRow;

// Add custom CSS for hiding scrollbars while allowing scrolling
const scrollbarHideStyles = `
  /* Hide scrollbar for Chrome, Safari and Opera */
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  .scrollbar-hide {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
`;

// Dynamically append the styles to the page
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.appendChild(document.createTextNode(scrollbarHideStyles));
  document.head.appendChild(styleElement);
}
