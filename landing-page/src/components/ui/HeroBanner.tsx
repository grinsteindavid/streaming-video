import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import Image from 'next/image';
import { Video } from '@/types/video';
import { Button } from './Button';

interface HeroBannerProps {
  featuredVideos: Video[];
  onPlayClick?: (video: Video) => void;
  onDetailsClick?: (video: Video) => void;
}

const BannerContainer = styled.section`
  position: relative;
  width: 100%;
  height: 70vh;
  max-height: 700px;
  min-height: 400px;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  overflow: hidden;
`;

const BannerSlide = styled.div<{ isActive: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: ${({ isActive }) => (isActive ? 1 : 0)};
  transition: opacity 1s ease-in-out;
  z-index: ${({ isActive }) => (isActive ? 1 : 0)};
`;

const BannerContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.xl};
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0));
  color: ${({ theme }) => theme.colors.text.primary};
  z-index: 2;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSizes.xxl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  max-width: 70%;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSizes.xl};
    max-width: 100%;
  }
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  max-width: 50%;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSizes.sm};
    max-width: 100%;
    -webkit-line-clamp: 2;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const Indicators = styled.div`
  position: absolute;
  bottom: ${({ theme }) => theme.spacing.xl};
  right: ${({ theme }) => theme.spacing.xl};
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  z-index: 3;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    bottom: ${({ theme }) => theme.spacing.lg};
    right: ${({ theme }) => theme.spacing.lg};
  }
`;

const Indicator = styled.button<{ isActive: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${({ isActive, theme }) =>
    isActive ? theme.colors.accent.primary : 'rgba(255, 255, 255, 0.5)'};
  border: none;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    background-color: ${({ isActive, theme }) =>
      isActive ? theme.colors.accent.primary : 'rgba(255, 255, 255, 0.8)'};
  }
`;

export const HeroBanner: React.FC<HeroBannerProps> = ({
  featuredVideos,
  onPlayClick,
  onDetailsClick,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Auto-rotate slides every 8 seconds
  useEffect(() => {
    if (featuredVideos.length <= 1) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % featuredVideos.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [featuredVideos.length]);
  
  // Handle indicator click
  const handleIndicatorClick = (index: number) => {
    setActiveIndex(index);
  };
  
  // Handle play click
  const handlePlayClick = () => {
    if (onPlayClick && featuredVideos[activeIndex]) {
      onPlayClick(featuredVideos[activeIndex]);
    }
  };
  
  // Handle details click
  const handleDetailsClick = () => {
    if (onDetailsClick && featuredVideos[activeIndex]) {
      onDetailsClick(featuredVideos[activeIndex]);
    }
  };
  
  if (featuredVideos.length === 0) {
    return null;
  }
  
  return (
    <BannerContainer>
      {featuredVideos.map((video, index) => (
        <BannerSlide key={video.id} isActive={index === activeIndex}>
          <Image
            src={video.thumbnailUrl}
            alt={video.title}
            fill
            priority={index === 0}
            style={{ objectFit: 'cover' }}
            sizes="100vw"
          />
        </BannerSlide>
      ))}
      
      <BannerContent>
        <Title>{featuredVideos[activeIndex]?.title}</Title>
        <Description>{featuredVideos[activeIndex]?.description}</Description>
        
        <ButtonContainer>
          <Button
            variant="primary"
            size="large"
            onClick={handlePlayClick}
          >
            Play
          </Button>
          <Button
            variant="secondary"
            size="large"
            onClick={handleDetailsClick}
          >
            More Details
          </Button>
        </ButtonContainer>
      </BannerContent>
      
      {featuredVideos.length > 1 && (
        <Indicators>
          {featuredVideos.map((_, index) => (
            <Indicator
              key={index}
              isActive={index === activeIndex}
              onClick={() => handleIndicatorClick(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </Indicators>
      )}
    </BannerContainer>
  );
};
