import React from 'react';
import Link from 'next/link';
import VideoPlayer from '@/components/video/video-player';
import ContentRow from '@/components/ui/content-row';
import Button from '@/components/ui/button';

// Export the generateMetadata function
export { generateMetadata } from './metadata';

type Params = {
  params: {
    id: string;
  };
};

// This would be replaced with actual API calls in a real application
const getVideoDetails = (id: string) => {
  // Sample data
  return {
    id,
    title: 'Cosmic Odyssey',
    description: 'A breathtaking journey through the cosmos, exploring the wonders of our universe from the smallest particles to the largest galactic structures. Join renowned scientists as they unravel the mysteries of dark matter, black holes, and the origins of life.',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4', // Sample video URL
    posterUrl: 'https://picsum.photos/1200/800?random=1',
    releaseYear: 2024,
    rating: 'PG-13',
    duration: '1h 45m',
    genres: ['Documentary', 'Science', 'Space'],
    cast: ['Dr. Jane Smith', 'Prof. Alan Johnson', 'Dr. Maria Rodriguez'],
    director: 'Christopher Anderson',
    studio: 'Cosmic Productions',
  };
};

const getSimilarVideos = () => {
  // Sample similar videos
  return [
    {
      id: 'similar1',
      title: 'Galactic Frontiers',
      posterUrl: 'https://picsum.photos/300/450?random=1',
      quality: 'HD' as 'HD' | '4K' | 'SD',
    },
    {
      id: 'similar2',
      title: 'Deep Space Mysteries',
      posterUrl: 'https://picsum.photos/300/450?random=2',
      quality: '4K' as '4K' | 'HD' | 'SD',
      isNew: true,
    },
    {
      id: 'similar3',
      title: 'The Quantum Realm',
      posterUrl: 'https://picsum.photos/300/450?random=3',
      quality: 'HD' as 'HD' | '4K' | 'SD',
    },
    {
      id: 'similar4',
      title: 'Beyond The Stars',
      posterUrl: 'https://picsum.photos/300/450?random=4',
      quality: '4K' as '4K' | 'HD' | 'SD',
    },
  ];
};

async function VideoDetails({ params }: Params) {
  // In Next.js App Router, params should be awaited before use
  const { id } = await params;
  const video = await getVideoDetails(id);
  const similarVideos = await getSimilarVideos();

  return (
    <div className="pb-16">
      {/* Video Player Section */}
      <div className="w-full aspect-video bg-background-dark">
        <VideoPlayer 
          src={video.videoUrl}
          poster={video.posterUrl}
          title={video.title}
          hasControls={true}
          savedProgress={30} // This would come from user context in a real app
        />
      </div>

      {/* Content Info Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">{video.title}</h1>
            
            <div className="flex items-center text-sm text-text-secondary mb-4 flex-wrap gap-2">
              {video.releaseYear && <span>{video.releaseYear}</span>}
              {video.rating && (
                <>
                  <span className="w-1 h-1 rounded-full bg-text-secondary mx-2" />
                  <span className="border border-text-secondary px-1 text-xs">
                    {video.rating}
                  </span>
                </>
              )}
              {video.duration && (
                <>
                  <span className="w-1 h-1 rounded-full bg-text-secondary mx-2" />
                  <span>{video.duration}</span>
                </>
              )}
              {video.genres && video.genres.length > 0 && (
                <>
                  <span className="w-1 h-1 rounded-full bg-text-secondary mx-2" />
                  <span>{video.genres.join(', ')}</span>
                </>
              )}
            </div>
            
            <div className="flex space-x-4 mb-8">
              <Button 
                variant="primary" 
                size="md"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                  </svg>
                }
              >
                Play
              </Button>
              
              <Button 
                variant="outline" 
                size="md"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                  </svg>
                }
              >
                Add to List
              </Button>
              
              <Button 
                variant="ghost" 
                size="md"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M15.75 4.5a3 3 0 11.825 2.066l-8.421 4.679a3.002 3.002 0 010 1.51l8.421 4.679a3 3 0 11-.729 1.31l-8.421-4.678a3 3 0 110-4.132l8.421-4.679a3 3 0 01-.096-.755z" clipRule="evenodd" />
                  </svg>
                }
              >
                Share
              </Button>
            </div>
            
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-text-primary mb-2">Synopsis</h2>
              <p className="text-text-secondary">{video.description}</p>
            </div>
            
            {video.cast && video.cast.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-text-primary mb-2">Cast</h2>
                <div className="flex flex-wrap gap-2">
                  {video.cast.map((actor, index) => (
                    <span 
                      key={index} 
                      className="bg-background-light px-3 py-1 rounded-full text-sm text-text-secondary"
                    >
                      {actor}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {video.director && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-text-primary mb-2">Director</h2>
                <span className="text-text-secondary">{video.director}</span>
              </div>
            )}
            
            {video.studio && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-text-primary mb-2">Studio</h2>
                <span className="text-text-secondary">{video.studio}</span>
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="md:w-80">
            <div className="bg-background-light rounded-lg p-4 mb-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Details</h2>
              
              <div className="space-y-3">
                {video.releaseYear && (
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Release Year</span>
                    <span className="text-text-primary">{video.releaseYear}</span>
                  </div>
                )}
                
                {video.rating && (
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Rating</span>
                    <span className="text-text-primary">{video.rating}</span>
                  </div>
                )}
                
                {video.duration && (
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Duration</span>
                    <span className="text-text-primary">{video.duration}</span>
                  </div>
                )}
                
                {video.genres && video.genres.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Genres</span>
                    <span className="text-text-primary text-right">{video.genres.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
            
            <Link 
              href="/"
              className="flex items-center text-text-secondary hover:text-primary-color transition-colors mb-6"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                <path fillRule="evenodd" d="M11.03 3.97a.75.75 0 010 1.06l-6.22 6.22H21a.75.75 0 010 1.5H4.81l6.22 6.22a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0z" clipRule="evenodd" />
              </svg>
              Back to Browse
            </Link>
          </div>
        </div>
      </div>

      {/* Similar Content Section */}
      <div className="mt-8">
        <ContentRow 
          title="More Like This"
          items={similarVideos} 
          aspectRatio="2:3"
        />
      </div>
    </div>
  );
}

export default VideoDetails;
