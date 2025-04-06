import React, { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { Card } from './Card';
import { Video } from '@/types/video';

interface CarouselProps {
  title: string;
  videos: Video[];
  cardSize?: 'small' | 'medium' | 'large';
  onVideoClick?: (video: Video) => void;
}

const CarouselContainer = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const CarouselTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const CarouselTrack = styled.div`
  position: relative;
  overflow: hidden;
`;

const CarouselInner = styled.div<{ translateX: number }>`
  display: flex;
  transition: transform 0.5s ease;
  transform: translateX(${({ translateX }) => translateX}px);
`;

const CardWrapper = styled.div<{ cardSize: string }>`
  flex: 0 0 auto;
  width: ${({ cardSize }) => 
    cardSize === 'small' ? 'calc(20% - 16px)' : 
    cardSize === 'medium' ? 'calc(33.333% - 16px)' : 
    'calc(50% - 16px)'};
  margin-right: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    width: ${({ cardSize }) => 
      cardSize === 'small' ? 'calc(25% - 16px)' : 
      cardSize === 'medium' ? 'calc(33.333% - 16px)' : 
      'calc(50% - 16px)'};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    width: ${({ cardSize }) => 
      cardSize === 'small' ? 'calc(33.333% - 16px)' : 
      'calc(50% - 16px)'};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: ${({ cardSize }) => 
      cardSize === 'small' ? 'calc(50% - 16px)' : 
      'calc(100% - 16px)'};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: calc(100% - 16px);
  }
`;

const NavigationButton = styled.button<{ direction: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${({ direction }) => direction === 'left' ? 'left: 0;' : 'right: 0;'}
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  z-index: 2;
  opacity: 0.7;
  transition: opacity 0.3s ease;
  
  &:hover {
    opacity: 1;
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

export const Carousel: React.FC<CarouselProps> = ({ 
  title, 
  videos, 
  cardSize = 'medium',
  onVideoClick 
}) => {
  const [translateX, setTranslateX] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  
  const trackRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  
  // Calculate if we can scroll left or right
  useEffect(() => {
    const checkScrollability = () => {
      if (trackRef.current && innerRef.current) {
        const trackWidth = trackRef.current.clientWidth;
        const innerWidth = innerRef.current.scrollWidth;
        
        setCanScrollLeft(translateX < 0);
        setCanScrollRight(translateX > -(innerWidth - trackWidth));
      }
    };
    
    checkScrollability();
    window.addEventListener('resize', checkScrollability);
    
    return () => {
      window.removeEventListener('resize', checkScrollability);
    };
  }, [translateX]);
  
  // Handle scroll left
  const handleScrollLeft = () => {
    if (trackRef.current) {
      const trackWidth = trackRef.current.clientWidth;
      const newTranslateX = Math.min(0, translateX + trackWidth);
      setTranslateX(newTranslateX);
    }
  };
  
  // Handle scroll right
  const handleScrollRight = () => {
    if (trackRef.current && innerRef.current) {
      const trackWidth = trackRef.current.clientWidth;
      const innerWidth = innerRef.current.scrollWidth;
      const newTranslateX = Math.max(-(innerWidth - trackWidth), translateX - trackWidth);
      setTranslateX(newTranslateX);
    }
  };
  
  // Handle video click
  const handleVideoClick = (video: Video) => {
    if (onVideoClick) {
      onVideoClick(video);
    }
  };
  
  return (
    <CarouselContainer>
      <CarouselTitle>{title}</CarouselTitle>
      <CarouselTrack ref={trackRef}>
        {canScrollLeft && (
          <NavigationButton 
            direction="left" 
            onClick={handleScrollLeft}
            aria-label="Scroll left"
          >
            &lt;
          </NavigationButton>
        )}
        
        <CarouselInner ref={innerRef} translateX={translateX}>
          {videos.map((video) => (
            <CardWrapper key={video.id} cardSize={cardSize}>
              <Card 
                video={video} 
                size={cardSize}
                onClick={() => handleVideoClick(video)}
              />
            </CardWrapper>
          ))}
        </CarouselInner>
        
        {canScrollRight && (
          <NavigationButton 
            direction="right" 
            onClick={handleScrollRight}
            aria-label="Scroll right"
          >
            &gt;
          </NavigationButton>
        )}
      </CarouselTrack>
    </CarouselContainer>
  );
};
