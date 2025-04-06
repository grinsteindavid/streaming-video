'use client';

import React, { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { HeroBanner } from '@/components/ui/HeroBanner';
import { Carousel } from '@/components/ui/Carousel';
import { SearchResults } from '@/components/search/SearchResults';
import { useSearch } from '@/context/SearchContext';
import { useVideoCategories, useFeaturedVideos } from '@/hooks/useVideos';
import { Video } from '@/types/video';

const HomeContainer = styled.div`
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 ${({ theme }) => theme.spacing.md};
  }
`;

const ContinueWatchingSection = styled.section`
  margin-top: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const ContinueWatchingTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const EmptyStateMessage = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  padding: ${({ theme }) => theme.spacing.lg} 0;
`;

export default function Home() {
  const router = useRouter();
  const { searchQuery } = useSearch();
  const [continueWatchingVideos, setContinueWatchingVideos] = useState<Video[]>([]);
  const featuredVideosRef = useRef<string>('');
  
  // Fetch featured videos for the hero banner
  const { data: featuredVideos = [], isLoading: isFeaturedLoading } = useFeaturedVideos();
  const typedFeaturedVideos = featuredVideos as Video[];
  
  // Fetch video categories
  const { data: videoCategories = [], isLoading: isCategoriesLoading } = useVideoCategories();
  const typedVideoCategories = videoCategories as { id: string; name: string; videos: Video[] }[];
  
  // Handle video click
  const handleVideoClick = (video: Video) => {
    router.push(`/video/${video.id}`);
  };
  
  // Load continue watching videos from localStorage
  useEffect(() => {
    // Only proceed if we have featured videos loaded
    if (typedFeaturedVideos.length === 0) return;
    
    // Create a signature of the current featured videos to detect changes
    const featuredVideoSignature = typedFeaturedVideos.map(v => v.id).sort().join(',');
    
    // Skip if we've already processed this exact set of featured videos
    if (featuredVideoSignature === featuredVideosRef.current) return;
    
    // Update our ref to avoid reprocessing the same data
    featuredVideosRef.current = featuredVideoSignature;
    
    try {
      const savedProgress = localStorage.getItem('videoProgress');
      if (savedProgress) {
        const progressData = JSON.parse(savedProgress);
        // Sort by most recent
        progressData.sort((a: any, b: any) => b.timestamp - a.timestamp);
        
        // Get videos for the progress items
        const watchingVideos = progressData.slice(0, 6).map((progress: any) => {
          return typedFeaturedVideos.find(video => video.id === progress.videoId);
        }).filter(Boolean) as Video[];
        
        setContinueWatchingVideos(watchingVideos);
      }
    } catch (err) {
      console.error('Failed to load video progress from localStorage', err);
    }
  }, [typedFeaturedVideos]); // Only depend on typedFeaturedVideos
  
  return (
    <MainLayout transparentHeader={true}>
      {/* Hero Banner */}
      <HeroBanner 
        featuredVideos={typedFeaturedVideos.slice(0, 3)} 
        onPlayClick={handleVideoClick}
        onDetailsClick={handleVideoClick}
      />
      
      <HomeContainer>
        {/* Continue Watching Section */}
        {continueWatchingVideos.length > 0 && (
          <ContinueWatchingSection>
            <ContinueWatchingTitle>Continue Watching</ContinueWatchingTitle>
            <Carousel 
              title="" 
              videos={continueWatchingVideos} 
              onVideoClick={handleVideoClick}
            />
          </ContinueWatchingSection>
        )}
        
        {/* Video Categories */}
        {isCategoriesLoading ? (
          <EmptyStateMessage>Loading categories...</EmptyStateMessage>
        ) : (
          typedVideoCategories.map(category => (
            <Carousel 
              key={category.id} 
              title={category.name} 
              videos={category.videos}
              cardSize={category.name === 'Featured' ? 'large' : 'medium'}
              onVideoClick={handleVideoClick}
            />
          ))
        )}
      </HomeContainer>
      
      {/* Search Results */}
      {searchQuery && <SearchResults onVideoClick={handleVideoClick} />}
    </MainLayout>
  );
}
