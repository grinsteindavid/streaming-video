'use client';

import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { MainLayout } from '@/components/layout/MainLayout';
import { Carousel } from '@/components/ui/Carousel';
import { useRouter } from 'next/navigation';
import { useFeaturedVideos } from '@/hooks/useVideos';
import { useWatchlist } from '@/context/WatchlistContext';
import { Video } from '@/types/video';

const PageContainer = styled.div`
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
  }
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSizes.xxl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xxl} 0;
  text-align: center;
`;

const EmptyStateTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const EmptyStateText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  max-width: 600px;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const EmptyStateButton = styled.button`
  background-color: ${({ theme }) => theme.colors.accent.primary};
  color: white;
  border: none;
  border-radius: 4px;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.accent.secondary};
  }
`;

const WatchlistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const WatchlistItem = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 16/9;
  cursor: pointer;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    
    /* Show remove button on hover */
    button {
      opacity: 1;
    }
  }
`;

const WatchlistItemImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const WatchlistItemOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: ${({ theme }) => theme.spacing.sm};
  background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0) 100%);
`;

const WatchlistItemTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: white;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease;
  
  &:hover {
    background-color: rgba(255, 0, 0, 0.7);
  }
`;

export default function WatchlistPage() {
  const router = useRouter();
  const { watchlist, removeFromWatchlist } = useWatchlist();
  
  // Fetch all videos to match with watchlist IDs
  const { data: allVideos = [] } = useFeaturedVideos();
  
  // Derive watchlist videos directly without useState
  const watchlistVideos = React.useMemo(() => {
    if (!allVideos || allVideos.length === 0 || watchlist.length === 0) {
      return [];
    }
    
    return watchlist
      .map(id => allVideos.find((video: Video) => video.id === id))
      .filter(Boolean) as Video[];
  }, [watchlist, allVideos]);
  
  // Handle video click
  const handleVideoClick = (video: Video) => {
    router.push(`/video/${video.id}`);
  };
  
  // Handle remove from watchlist
  const handleRemoveFromWatchlist = (e: React.MouseEvent, videoId: string) => {
    e.stopPropagation(); // Prevent triggering the parent click event
    removeFromWatchlist(videoId);
  };
  
  // Handle browse videos click
  const handleBrowseClick = () => {
    router.push('/');
  };
  
  return (
    <MainLayout>
      <PageContainer>
        <PageTitle>My Watchlist</PageTitle>
        
        {watchlistVideos.length === 0 ? (
          <EmptyState>
            <EmptyStateTitle>Your watchlist is empty</EmptyStateTitle>
            <EmptyStateText>
              Add videos to your watchlist to keep track of content you want to watch later.
              You can add videos to your watchlist by clicking the star icon on any video.
            </EmptyStateText>
            <EmptyStateButton onClick={handleBrowseClick}>
              Browse Videos
            </EmptyStateButton>
          </EmptyState>
        ) : (
          <WatchlistGrid>
            {watchlistVideos.map(video => (
              <WatchlistItem 
                key={video.id} 
                onClick={() => handleVideoClick(video)}
              >
                <WatchlistItemImage 
                  src={video.thumbnailUrl} 
                  alt={video.title} 
                />
                <WatchlistItemOverlay>
                  <WatchlistItemTitle>{video.title}</WatchlistItemTitle>
                </WatchlistItemOverlay>
                <RemoveButton 
                  onClick={(e) => handleRemoveFromWatchlist(e, video.id)}
                  aria-label="Remove from watchlist"
                >
                  ×
                </RemoveButton>
              </WatchlistItem>
            ))}
          </WatchlistGrid>
        )}
      </PageContainer>
    </MainLayout>
  );
}
