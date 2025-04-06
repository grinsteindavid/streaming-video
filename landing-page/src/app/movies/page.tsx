'use client';

import React from 'react';
import styled from '@emotion/styled';
import { MainLayout } from '@/components/layout/MainLayout';
import { Carousel } from '@/components/ui/Carousel';
import { useRouter } from 'next/navigation';
import { useVideoCategories, useFeaturedVideos } from '@/hooks/useVideos';
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

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.text.primary};
`;

export default function MoviesPage() {
  const router = useRouter();
  
  // Fetch featured videos
  const { data: featuredVideos = [], isLoading: isFeaturedLoading } = useFeaturedVideos();
  const typedFeaturedVideos = featuredVideos as Video[];
  
  // Filter only movies (not TV shows)
  const movies = typedFeaturedVideos.filter(video => 
    !video.genre.includes('TV Series') && !video.genre.includes('TV Show')
  );
  
  // Handle video click
  const handleVideoClick = (video: Video) => {
    router.push(`/video/${video.id}`);
  };
  
  // Group movies by genre
  const moviesByGenre: Record<string, Video[]> = {};
  
  movies.forEach(movie => {
    movie.genre.forEach(genre => {
      if (!moviesByGenre[genre]) {
        moviesByGenre[genre] = [];
      }
      moviesByGenre[genre].push(movie);
    });
  });
  
  return (
    <MainLayout>
      <PageContainer>
        <PageTitle>Movies</PageTitle>
        
        {/* Featured Movies */}
        <SectionTitle>Featured Movies</SectionTitle>
        <Carousel 
          videos={movies.slice(0, 10)} 
          onVideoClick={handleVideoClick}
        />
        
        {/* Movies by Genre */}
        {Object.entries(moviesByGenre).map(([genre, genreMovies]) => (
          genreMovies.length > 0 && (
            <React.Fragment key={genre}>
              <SectionTitle>{genre}</SectionTitle>
              <Carousel 
                videos={genreMovies} 
                onVideoClick={handleVideoClick}
              />
            </React.Fragment>
          )
        ))}
      </PageContainer>
    </MainLayout>
  );
}
