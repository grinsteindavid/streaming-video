'use client';

import React from 'react';
import styled from '@emotion/styled';
import { Video } from '@/types/video';
import { useRouter } from 'next/navigation';

interface VideoCardProps {
  video: Video;
}

const Card = styled.div`
  position: relative;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    
    .thumbnail-overlay {
      opacity: 1;
    }
  }
`;

const ThumbnailContainer = styled.div`
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 aspect ratio */
  overflow: hidden;
`;

const Thumbnail = styled.div<{ imageUrl: string }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${props => props.imageUrl});
  background-size: cover;
  background-position: center;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const ThumbnailOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.7));
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  svg {
    width: 48px;
    height: 48px;
    color: white;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  }
`;

const ProgressBar = styled.div<{ progress: number }>`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  width: ${props => props.progress}%;
  background-color: ${({ theme }) => theme.colors.accent.primary};
  z-index: 2;
`;

const ContentContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Metadata = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const Badge = styled.span`
  display: inline-block;
  padding: ${({ theme }) => `4px ${theme.spacing.xs}`};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  color: ${({ theme }) => theme.colors.text.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

const PlayIcon = () => (
  <svg className="play-icon" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);

export const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const router = useRouter();
  
  // Format duration from seconds to MM:SS
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Format release year
  const getReleaseYear = (dateString: string) => {
    return new Date(dateString).getFullYear();
  };
  
  // Handle click to navigate to video detail page
  const handleClick = () => {
    router.push(`/video/${video.id}`);
  };
  
  return (
    <Card onClick={handleClick}>
      <ThumbnailContainer>
        <Thumbnail imageUrl={video.thumbnailUrl} />
        <ThumbnailOverlay className="thumbnail-overlay">
          <PlayIcon />
        </ThumbnailOverlay>
        {video.progress && video.progress > 0 && (
          <ProgressBar progress={(video.progress / video.duration) * 100} />
        )}
      </ThumbnailContainer>
      
      <ContentContainer>
        <Title>{video.title}</Title>
        <Metadata>
          <span>{getReleaseYear(video.releaseDate)}</span>
          <span>•</span>
          <span>{formatDuration(video.duration)}</span>
          {video.rating > 0 && (
            <>
              <span>•</span>
              <span>★ {video.rating.toFixed(1)}</span>
            </>
          )}
        </Metadata>
        <div>
          {video.genre.slice(0, 2).map((genre, index) => (
            <Badge key={index} style={{ marginRight: '4px' }}>
              {genre}
            </Badge>
          ))}
        </div>
      </ContentContainer>
    </Card>
  );
};
