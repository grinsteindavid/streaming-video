'use client';

import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import Image from 'next/image';
import { Video } from '@/types/video';
import { Button } from './Button';
import { useVideo } from '@/context/VideoContext';
import { useWatchlist } from '@/context/WatchlistContext';

interface CardProps {
  video: Video;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
}

const CardContainer = styled.div<{ size: string; isHovered: boolean }>`
  position: relative;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  transition: ${({ theme }) => theme.transitions.default};
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  width: 100%;
  height: 0;
  padding-bottom: ${({ size }) => 
    size === 'small' ? '150%' : 
    size === 'medium' ? '56.25%' : 
    '75%'/* large */};
  transform: ${({ isHovered }) => isHovered ? 'scale(1.05)' : 'scale(1)'};
  z-index: ${({ isHovered }) => isHovered ? 1 : 0};
  
  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const ThumbnailContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const InfoOverlay = styled.div<{ isHovered: boolean }>`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0));
  padding: ${({ theme }) => theme.spacing.md};
  transform: translateY(${({ isHovered }) => isHovered ? '0' : '100%'});
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Title = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
`;

const Metadata = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const BadgeContainer = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing.sm};
  right: ${({ theme }) => theme.spacing.sm};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  z-index: 1;
`;

const Badge = styled.span<{ type: 'new' | 'featured' }>`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  background-color: ${({ theme, type }) => 
    type === 'new' ? theme.colors.accent.danger : theme.colors.accent.secondary};
  color: #000;
`;

const ProgressBar = styled.div<{ progress: number }>`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  width: ${({ progress }) => `${progress}%`};
  background-color: ${({ theme }) => theme.colors.accent.primary};
  z-index: 2;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const WatchlistButton = styled.button<{ isInWatchlist: boolean }>`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.6);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.2s ease;
  color: ${({ isInWatchlist, theme }) => isInWatchlist ? theme.colors.accent.primary : 'white'};
  opacity: 0.7;
  
  &:hover {
    opacity: 1;
    background-color: rgba(0, 0, 0, 0.8);
  }
`;

export const Card: React.FC<CardProps> = ({ video, onClick, size = 'medium' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { getVideoProgressById } = useVideo();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  
  // Calculate progress percentage
  const progressPercentage = video.duration > 0 
    ? (getVideoProgressById(video.id) / video.duration) * 100 
    : 0;
  
  // Format duration (seconds to MM:SS)
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Handle watchlist button click
  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent click event
    toggleWatchlist(video.id);
  };

  return (
    <CardContainer 
      size={size}
      isHovered={isHovered}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <WatchlistButton 
        isInWatchlist={isInWatchlist(video.id)}
        onClick={handleWatchlistClick}
        aria-label={isInWatchlist(video.id) ? 'Remove from watchlist' : 'Add to watchlist'}
      >
        {isInWatchlist(video.id) ? '★' : '☆'}
      </WatchlistButton>
      
      <ThumbnailContainer>
        <Image 
          src={video.thumbnailUrl} 
          alt={video.title}
          fill
          style={{ objectFit: 'cover' }}
          sizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw'
        />
      </ThumbnailContainer>
      
      {/* Badges */}
      <BadgeContainer>
        {video.isNew && <Badge type="new">NEW</Badge>}
        {video.isFeatured && <Badge type="featured">FEATURED</Badge>}
      </BadgeContainer>
      
      {/* Progress bar */}
      {progressPercentage > 0 && progressPercentage < 98 && (
        <ProgressBar progress={progressPercentage} />
      )}
      
      {/* Info overlay */}
      <InfoOverlay isHovered={isHovered}>
        <Title>{video.title}</Title>
        <Metadata>
          <span>{formatDuration(video.duration)}</span>
          <span>•</span>
          <span>{new Date(video.releaseDate).getFullYear()}</span>
          {video.rating > 0 && (
            <>
              <span>•</span>
              <span>★ {video.rating.toFixed(1)}</span>
            </>
          )}
        </Metadata>
        
        <ButtonContainer>
          <Button 
            variant="primary" 
            size="small" 
            fullWidth 
            onClick={(e) => {
              e.stopPropagation();
              // Navigate to video player
              window.location.href = `/video/${video.id}`;
            }}
          >
            Play
          </Button>
          <Button 
            variant="secondary" 
            size="small" 
            onClick={(e) => {
              e.stopPropagation();
              // Add to watchlist functionality would go here
              console.log('Add to watchlist:', video.id);
            }}
          >
            + Watchlist
          </Button>
        </ButtonContainer>
      </InfoOverlay>
    </CardContainer>
  );
};
