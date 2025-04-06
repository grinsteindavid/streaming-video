export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number; // in seconds
  releaseDate: string;
  genre: string[];
  cast: string[];
  director: string;
  rating: number;
  isFeatured?: boolean;
  isNew?: boolean;
  subtitles?: Subtitle[];
}

export interface Subtitle {
  language: string;
  url: string;
}

export interface VideoProgress {
  videoId: string;
  progress: number; // in seconds
  timestamp: number; // when the progress was last updated
}

export interface VideoCategory {
  id: string;
  name: string;
  videos: Video[];
}
