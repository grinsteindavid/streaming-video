'use client';

import React from 'react';
import styled from '@emotion/styled';
import { Video } from '@/types/video';
// Import the VideoCard component
// This will be resolved at runtime since both files are in the same directory
import { VideoCard } from './VideoCard';

interface VideoGridProps {
  videos: Video[];
  title?: string;
}

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  width: 100%;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: ${({ theme }) => theme.spacing.md};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const GridTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const EmptyState = styled.div`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
`;

// Export the VideoGrid component for use in other files
export const VideoGrid: React.FC<VideoGridProps> = ({ videos, title }) => {
  if (!videos || videos.length === 0) {
    return (
      <div>
        {title && <GridTitle>{title}</GridTitle>}
        <EmptyState>No videos found</EmptyState>
      </div>
    );
  }

  return (
    <div>
      {title && <GridTitle>{title}</GridTitle>}
      <GridContainer>
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </GridContainer>
    </div>
  );
};
