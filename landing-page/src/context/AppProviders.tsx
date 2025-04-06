'use client';

import React from 'react';
import { ThemeProvider } from '@emotion/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { VideoProvider } from './VideoContext';
import { SearchProvider } from './SearchContext';
import { theme } from '@/styles/theme';
import { Global } from '@emotion/react';
import { globalStyles } from '@/styles/global';
import { Video } from '@/types/video';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

interface AppProvidersProps {
  children: React.ReactNode;
  initialVideos?: Video[];
}

export const AppProviders: React.FC<AppProvidersProps> = ({ 
  children,
  initialVideos = [] 
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <Global styles={globalStyles} />
        <VideoProvider>
          <SearchProvider videos={initialVideos}>
            {children}
          </SearchProvider>
        </VideoProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
