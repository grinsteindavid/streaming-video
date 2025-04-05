import { VideoResponse, VideoStatus } from '@/types/api';

// Categories matching those in the upload form
const categories = [
  'Programming',
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Machine Learning',
  'DevOps',
  'Design',
  'Business',
  'Marketing',
  'Productivity'
];

const getRandomCategories = () => {
  const numCategories = Math.floor(Math.random() * 3) + 1; // 1-3 categories
  const shuffled = [...categories].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numCategories);
};

const getRandomTags = () => {
  const tags = [
    'javascript', 'typescript', 'react', 'nextjs', 'node', 'python', 'beginner', 
    'advanced', 'tutorial', 'howto', 'webdev', 'frontend', 'backend', 'fullstack',
    'coding', 'programming', 'development', 'software', 'tech', 'technology'
  ];
  
  const numTags = Math.floor(Math.random() * 5) + 1; // 1-5 tags
  const shuffled = [...tags].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numTags);
};

const statuses: VideoStatus[] = ['uploaded', 'processing', 'ready', 'error', 'draft', 'published'];

const getRandomStatus = (): VideoStatus => {
  const index = Math.floor(Math.random() * statuses.length);
  return statuses[index];
};

export const generateMockVideos = (count: number): VideoResponse[] => {
  const videos: VideoResponse[] = [];
  
  for (let i = 0; i < count; i++) {
    const id = `video-${i + 1}`;
    const uploadDate = new Date();
    uploadDate.setDate(uploadDate.getDate() - Math.floor(Math.random() * 30)); // Random date in last 30 days
    
    const status = getRandomStatus();
    const isPublic = Math.random() > 0.2; // 80% chance of being public
    
    // Generate random duration between 1-60 minutes
    const durationMinutes = Math.floor(Math.random() * 60) + 1;
    const duration = durationMinutes * 60; // Convert to seconds
    
    const video: VideoResponse = {
      id,
      title: `Sample Video ${i + 1}`,
      description: `This is a sample video description for video ${i + 1}. It contains detailed information about the content.`,
      duration,
      upload_date: uploadDate.toISOString(),
      status,
      thumbnail_url: i % 5 === 0 ? null : `https://picsum.photos/id/${i + 100}/640/360`, // Some videos have no thumbnail
      tags: getRandomTags(),
      categories: getRandomCategories(),
      isPublic,
      stats: {
        views: Math.floor(Math.random() * 1000),
        average_rating: Math.floor(Math.random() * 50) / 10, // 0.0-5.0 rating
        total_ratings: Math.floor(Math.random() * 100),
        total_watch_time: Math.floor(Math.random() * 100000) // in seconds
      }
    };
    
    videos.push(video);
  }
  
  return videos;
};

// Pre-generate 30 mock videos
export const mockVideos = generateMockVideos(30);
