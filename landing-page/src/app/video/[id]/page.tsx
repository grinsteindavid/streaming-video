'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import styled from '@emotion/styled';
import { MainLayout } from '@/components/layout/MainLayout';
import { VideoPlayer } from '@/components/video/VideoPlayer';
import { Carousel } from '@/components/ui/Carousel';
import { useVideo, useVideos } from '@/hooks/useVideos';
import { Video } from '@/types/video';

const VideoPageContainer = styled.div`
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0;
  }
`;

const RelatedVideosSection = styled.section`
  margin-top: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding: 0 ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 ${({ theme }) => theme.spacing.md};
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const ErrorTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSizes.xxl};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ErrorMessage = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const BackButton = styled.button`
  background-color: ${({ theme }) => theme.colors.accent.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.accent.primary}cc;
  }
`;

export default function VideoPage() {
  const params = useParams();
  const router = useRouter();
  const videoId = params?.id as string;
  
  // Fetch the video details
  const { data: video, isLoading, error } = useVideo(videoId);
  const typedVideo = video as Video | undefined;
  
  // Fetch related videos (same genre)
  const genre = typedVideo?.genre?.[0];
  const { data: relatedVideos = [] } = useVideos({
    genre,
    enabled: !!genre,
  });
  const typedRelatedVideos = relatedVideos as Video[];
  
  // Filter out the current video and limit to 6 videos
  const filteredRelatedVideos = typedRelatedVideos
    .filter((relatedVideo) => relatedVideo.id !== videoId)
    .slice(0, 6);
  
  // Handle back button click
  const handleBack = () => {
    router.back();
  };
  
  // Handle related video click
  const handleVideoClick = (clickedVideo: Video) => {
    router.push(`/video/${clickedVideo.id}`);
  };
  
  if (isLoading) {
    return (
      <MainLayout>
        <LoadingContainer>Loading video...</LoadingContainer>
      </MainLayout>
    );
  }
  
  if (error || !typedVideo) {
    return (
      <MainLayout>
        <ErrorContainer>
          <ErrorTitle>Video Not Found</ErrorTitle>
          <ErrorMessage>
            The video you're looking for doesn't exist or is currently unavailable.
          </ErrorMessage>
          <BackButton onClick={handleBack}>Go Back</BackButton>
        </ErrorContainer>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <VideoPageContainer>
        <VideoPlayer video={typedVideo as Video} onBack={handleBack} />
        
        {filteredRelatedVideos.length > 0 && (
          <RelatedVideosSection>
            <Carousel
              title="More Like This"
              videos={filteredRelatedVideos}
              onVideoClick={handleVideoClick}
            />
          </RelatedVideosSection>
        )}
      </VideoPageContainer>
    </MainLayout>
  );
}
