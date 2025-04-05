'use client';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { analyticsService, AnalyticsResponse, ViewsByDateResponse, TopVideoResponse } from '@/services/analytics-service';

/**
 * Hook for fetching dashboard summary statistics
 */
export function useDashboardSummary(options?: UseQueryOptions<AnalyticsResponse>) {
  return useQuery<AnalyticsResponse>({
    queryKey: ['analytics', 'summary'],
    queryFn: () => analyticsService.getDashboardSummary(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options
  });
}

/**
 * Hook for fetching views by date
 * @param period Time period (7d, 30d, 90d)
 */
export function useViewsByDate(period: string = '7d', options?: UseQueryOptions<ViewsByDateResponse[]>) {
  return useQuery<ViewsByDateResponse[]>({
    queryKey: ['analytics', 'views', period],
    queryFn: () => analyticsService.getViewsByDate(period),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options
  });
}

/**
 * Hook for fetching top performing videos
 * @param limit Number of videos to return
 */
export function useTopVideos(limit: number = 5, options?: UseQueryOptions<TopVideoResponse[]>) {
  return useQuery<TopVideoResponse[]>({
    queryKey: ['analytics', 'top-videos', limit],
    queryFn: () => analyticsService.getTopVideos(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options
  });
}
