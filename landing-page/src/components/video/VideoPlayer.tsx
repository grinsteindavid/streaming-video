'use client';

import React, { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { useVideo } from '@/context/VideoContext';
import { Video } from '@/types/video';
import dynamic from 'next/dynamic';

// We'll use refs to store the dynamically loaded modules
let videojs: any = null;

interface VideoPlayerProps {
  video: Video;
  onBack?: () => void;
}

const PlayerContainer = styled.div`
  position: relative;
  width: 100%;
  background-color: #000;
  overflow: hidden;
  
  .video-js {
    width: 100%;
    height: 100%;
  }
  
  .vjs-big-play-button {
    background-color: rgba(0, 0, 0, 0.45);
    border: none;
    border-radius: 50%;
    font-size: 1.5em;
    height: 2em;
    line-height: 2em;
    width: 2em;
    margin-top: -1em;
    margin-left: -1em;
    transition: all 0.3s ease;
    
    &:hover {
      background-color: ${({ theme }) => theme.colors.accent.primary};
      transform: scale(1.1);
    }
  }
  
  .vjs-control-bar {
    background-color: rgba(0, 0, 0, 0.5);
  }
  
  .vjs-progress-control .vjs-play-progress {
    background-color: ${({ theme }) => theme.colors.accent.primary};
  }
  
  .vjs-volume-panel .vjs-volume-level {
    background-color: ${({ theme }) => theme.colors.accent.primary};
  }
  
  .vjs-menu-button-popup .vjs-menu {
    background-color: rgba(0, 0, 0, 0.8);
  }
`;

const BackButton = styled.button`
  position: absolute;
  top: ${({ theme }) => theme.spacing.md};
  left: ${({ theme }) => theme.spacing.md};
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.7);
  }
`;

const VideoInfo = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.background.secondary};
`;

const VideoTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const VideoMetadata = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
`;

const VideoDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const CastInfo = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const CastTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const CastList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
`;

const CastItem = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
`;

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, onBack }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<any>(null);
  const { updateVideoProgress, getVideoProgressById } = useVideo();
  const [playerReady, setPlayerReady] = useState(false);
  
  // Load video.js and HLS plugin dynamically on client side
  useEffect(() => {
    const loadVideoLibraries = async () => {
      try {
        // Dynamically import video.js and its CSS
        const vjsModule = await import('video.js');
        videojs = vjsModule.default;
        await import('video.js/dist/video-js.css');
        
        // Instead of importing the HLS plugin directly, we'll use video.js's HTTP streaming
        // which is more compatible with Next.js
        await import('@videojs/http-streaming');
        
        setPlayerReady(true);
      } catch (error) {
        console.error('Failed to load video libraries:', error);
      }
    };
    
    loadVideoLibraries();
    
    // Cleanup function
    return () => {
      videojs = null;
    };
  }, []);
  
  // Initialize video.js player
  useEffect(() => {
    if (!videoRef.current || !playerReady || !videojs) return;
    
    // Get saved progress
    const savedProgress = getVideoProgressById(video.id);
    
    // Initialize player
    const player = videojs(videoRef.current, {
      autoplay: false,
      controls: true,
      responsive: true,
      fluid: true,
      sources: [{
        src: video.videoUrl,
        type: 'application/vnd.apple.mpegurl' // HLS format with more compatible MIME type
      }],
      poster: video.thumbnailUrl,
      playbackRates: [0.5, 1, 1.25, 1.5, 2],
      controlBar: {
        children: [
          'playToggle',
          'progressControl',
          'volumePanel',
          'currentTimeDisplay',
          'timeDivider',
          'durationDisplay',
          'playbackRateMenuButton',
          'subtitlesButton',
          'fullscreenToggle'
        ]
      }
    }, () => {
      setPlayerReady(true);
      
      // Set saved progress if available
      if (savedProgress > 0) {
        player.currentTime(savedProgress);
      }
      
      // Track progress
      player.on('timeupdate', () => {
        const currentTime = player.currentTime();
        updateVideoProgress(video.id, currentTime);
      });
    });
    
    playerRef.current = player;
    
    // Clean up
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [video, updateVideoProgress, getVideoProgressById]);
  
  // Format release date
  const formatReleaseDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <div>
      <PlayerContainer>
        {onBack && (
          <BackButton onClick={onBack}>
            ← Back
          </BackButton>
        )}
        {!playerReady ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
            <p style={{ color: 'white' }}>Loading video player...</p>
          </div>
        ) : (
          <div data-vjs-player>
            <video
              ref={videoRef}
              className="video-js vjs-big-play-centered"
            />
          </div>
        )}
      </PlayerContainer>
      
      <VideoInfo>
        <VideoTitle>{video.title}</VideoTitle>
        <VideoMetadata>
          <span>{formatReleaseDate(video.releaseDate)}</span>
          <span>•</span>
          <span>{Math.floor(video.duration / 60)} min</span>
          {video.rating > 0 && (
            <>
              <span>•</span>
              <span>★ {video.rating.toFixed(1)}</span>
            </>
          )}
          <span>•</span>
          <span>{video.genre.join(', ')}</span>
        </VideoMetadata>
        
        <VideoDescription>{video.description}</VideoDescription>
        
        <CastInfo>
          <CastTitle>Cast & Crew</CastTitle>
          <CastList>
            {video.cast.map((actor, index) => (
              <CastItem key={index}>{actor}</CastItem>
            ))}
            <CastItem>
              <strong>Director:</strong> {video.director}
            </CastItem>
          </CastList>
        </CastInfo>
      </VideoInfo>
    </div>
  );
};
