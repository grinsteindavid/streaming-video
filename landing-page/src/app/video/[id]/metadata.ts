import { Metadata } from 'next';

// Function to generate metadata for a video page
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  // In a real application, this would fetch the video data from an API
  // For now, we'll use mock data based on the ID
  // In Next.js App Router, params should be awaited before use
  const { id } = await params;
  const videoId = id;
  
  // Simulate fetching video details
  const videoDetails = await getVideoDetails(videoId);
  
  if (!videoDetails) {
    return {
      title: 'Video Not Found | StreamFlix',
      description: 'The requested video could not be found.',
    };
  }
  
  return {
    title: `${videoDetails.title} | StreamFlix`,
    description: videoDetails.description,
    keywords: `${videoDetails.title}, ${videoDetails.genres?.join(', ')}, streaming, watch online, StreamFlix`,
    openGraph: {
      title: videoDetails.title,
      description: videoDetails.description,
      type: 'video.movie',
      url: `https://streamflix.example.com/video/${videoId}`,
      images: [
        {
          url: videoDetails.posterUrl,
          width: 1200,
          height: 630,
          alt: videoDetails.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: videoDetails.title,
      description: videoDetails.description,
      images: [videoDetails.posterUrl],
    },
  };
}

// Mock function to get video details
// In a real app, this would be a database or API call
async function getVideoDetails(id: string) {
  // For demonstration purposes, return mock data
  return {
    id,
    title: id.includes('similar') ? 
      ['Galactic Frontiers', 'Deep Space Mysteries', 'The Quantum Realm', 'Beyond The Stars'][parseInt(id.replace('similar', '')) - 1] :
      id.includes('trending') ?
        ['Cosmic Odyssey', 'Desert Mirage', 'Urban Legends', 'Mountain Echo'][parseInt(id.replace('trending', '')) - 1] :
        id.includes('continue') ?
          ['The Last Guardian', 'Emerald Forest', 'Skyward', 'Arctic Frontier'][parseInt(id.replace('continue', '')) - 1] :
          id.includes('recommended') ?
            ["Whispering Pines", "Electric Soul", "Titan's Shadow", "Desert Wind"][parseInt(id.replace('recommended', '')) - 1] :
            'Cosmic Odyssey',
    description: 'A breathtaking journey through the cosmos, exploring the wonders of our universe from the smallest particles to the largest galactic structures.',
    posterUrl: `https://picsum.photos/1200/630?random=${id.includes('similar') ? '7' : '8'}`,
    genres: ['Documentary', 'Science', 'Space'],
  };
}
