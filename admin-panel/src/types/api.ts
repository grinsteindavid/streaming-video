export interface Video {
  id: string;
  title: string;
  description: string;
  duration: number; // in seconds
  upload_date: string; // ISO string
  status: VideoStatus;
  thumbnail_url: string | null;
  tags: string[];
  isPublic: boolean;
  categories: string[];
}

export type VideoStatus = 'uploaded' | 'processing' | 'ready' | 'error' | 'draft' | 'published';

export interface VideoFile {
  id: string;
  video_id: string;
  quality: string; // e.g., '720p', '1080p'
  file_path: string;
  size: number; // in bytes
}

export interface ViewStats {
  id: string;
  video_id: string;
  user_id?: string;
  timestamp: string; // ISO string
  watch_duration: number; // in seconds
  ip_address: string;
}

export interface Rating {
  id: string;
  video_id: string;
  user_id: string;
  rating: number; // 1-5
  timestamp: string; // ISO string
}

// For API requests
export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface VideoFilterParams {
  search?: string;
  status?: VideoStatus;
  categories?: string[];
  tags?: string[];
  startDate?: string;
  endDate?: string;
  isPublic?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface VideoResponse extends Video {
  stats?: {
    views: number;
    average_rating: number;
    total_ratings: number;
    total_watch_time: number; // in seconds
  };
}

export type CreateVideoRequest = Omit<Video, 'id' | 'duration' | 'upload_date' | 'thumbnail_url'>;

export type UpdateVideoRequest = Partial<Omit<Video, 'id' | 'duration' | 'upload_date'>>;

export interface VideoUploadResponse {
  id: string;
  upload_url: string;
  success: boolean;
}
