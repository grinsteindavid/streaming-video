import { apiClient } from './api-client';

export interface AnalyticsResponse {
  totalVideos: number;
  totalViews: number;
  averageEngagement: number;
  storageUsed: number;
  change: {
    videos: number;
    views: number;
    engagement: number;
    storage: number;
  };
}

export interface ViewsByDateResponse {
  date: string;
  views: number;
}

export interface TopVideoResponse {
  id: string;
  title: string;
  thumbnail_url: string | null;
  views: number;
  engagement: number;
}

/**
 * Service for fetching analytics data
 */
export const analyticsService = {
  /**
   * Get dashboard summary statistics
   */
  async getDashboardSummary(): Promise<AnalyticsResponse> {
    return apiClient.get<AnalyticsResponse>('/analytics/summary');
  },

  /**
   * Get views by date for a given time period
   * @param period - Time period (e.g., '7d', '30d', '90d')
   */
  async getViewsByDate(period: string): Promise<ViewsByDateResponse[]> {
    return apiClient.get<ViewsByDateResponse[]>(`/analytics/views?period=${period}`);
  },

  /**
   * Get top performing videos
   * @param limit - Number of videos to return
   */
  async getTopVideos(limit: number = 5): Promise<TopVideoResponse[]> {
    return apiClient.get<TopVideoResponse[]>(`/analytics/top-videos?limit=${limit}`);
  }
};
