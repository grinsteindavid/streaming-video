// Image import removed as it's not used directly in this file
import HeroBanner from '../components/ui/hero-banner';
import ContentRow from '../components/ui/content-row';

// Mock data for hero banner
const heroItems = [
  {
    id: 'hero1',
    title: 'Interstellar Journey',
    description: 'Follow the adventures of space explorers as they embark on a mission to save humanity by finding a new habitable planet. With breathtaking visuals and an emotional storyline, this sci-fi epic will take you across galaxies and dimensions.',
    backgroundUrl: 'https://picsum.photos/1600/900?random=1',
    logoUrl: undefined,
    releaseYear: 2024,
    rating: 'PG-13',
    duration: '2h 49m',
    genres: ['Sci-Fi', 'Adventure', 'Drama'],
  },
  {
    id: 'hero2',
    title: 'Ocean Depths',
    description: 'Dive into the mysterious world beneath the waves in this stunning nature documentary. Explore coral reefs, deep-sea trenches, and encounter the most fascinating creatures of the ocean.',
    backgroundUrl: 'https://picsum.photos/1600/900?random=2',
    releaseYear: 2023,
    rating: 'G',
    duration: '1h 35m',
    genres: ['Documentary', 'Nature'],
  },
  {
    id: 'hero3',
    title: 'Midnight Chase',
    description: 'When a former special agent\'s family is targeted by a notorious crime syndicate, he must return to his dangerous past life for one final mission: to protect what matters most.',
    backgroundUrl: 'https://picsum.photos/1600/900?random=3',
    releaseYear: 2024,
    rating: 'R',
    duration: '2h 10m',
    genres: ['Action', 'Thriller', 'Crime'],
  },
];

// Mock data for content rows
const trendingNowItems = [
  {
    id: 'trending1',
    title: 'Cosmic Odyssey',
    posterUrl: 'https://picsum.photos/300/450?random=3',
    quality: '4K' as '4K' | 'HD' | 'SD',
  },
  {
    id: 'trending2',
    title: 'Desert Mirage',
    posterUrl: 'https://picsum.photos/300/450?random=4',
    quality: 'HD' as 'HD' | '4K' | 'SD',
    isNew: true,
  },
  {
    id: 'trending3',
    title: 'Urban Legends',
    posterUrl: 'https://picsum.photos/300/450?random=5',
    quality: 'HD' as 'HD' | '4K' | 'SD',
  },
  {
    id: 'trending4',
    title: 'Mountain Echo',
    posterUrl: 'https://picsum.photos/300/450?random=6',
    quality: '4K' as '4K' | 'HD' | 'SD',
  },
  {
    id: 'trending5',
    title: 'Twilight Secrets',
    posterUrl: 'https://picsum.photos/300/450?random=7',
    quality: 'HD' as 'HD' | '4K' | 'SD',
  },
  {
    id: 'trending6',
    title: 'Forgotten Kingdom',
    posterUrl: 'https://picsum.photos/300/450?random=8',
    quality: '4K' as '4K' | 'HD' | 'SD',
    isNew: true,
  },
  {
    id: 'trending7',
    title: 'Neon Dreams',
    posterUrl: 'https://picsum.photos/300/450?random=9',
    quality: 'HD' as 'HD' | '4K' | 'SD',
  },
];

const continueWatchingItems = [
  {
    id: 'continue1',
    title: 'The Last Guardian',
    posterUrl: 'https://picsum.photos/300/169?random=10',
    progress: 65,
    quality: 'HD' as 'HD' | '4K' | 'SD',
  },
  {
    id: 'continue2',
    title: 'Emerald Forest',
    posterUrl: 'https://picsum.photos/300/169?random=11',
    progress: 32,
    quality: '4K' as '4K' | 'HD' | 'SD',
  },
  {
    id: 'continue3',
    title: 'Skyward',
    posterUrl: 'https://picsum.photos/300/169?random=12',
    progress: 78,
    quality: 'HD' as 'HD' | '4K' | 'SD',
  },
  {
    id: 'continue4',
    title: 'Arctic Frontier',
    posterUrl: 'https://picsum.photos/300/169?random=13',
    progress: 12,
    quality: '4K' as '4K' | 'HD' | 'SD',
  },
];

const recommendedItems = [
  {
    id: 'recommended1',
    title: 'Whispering Pines',
    posterUrl: 'https://picsum.photos/300/450?random=2',
    quality: 'HD' as 'HD' | '4K' | 'SD',
  },
  {
    id: 'recommended2',
    title: 'Electric Soul',
    posterUrl: 'https://picsum.photos/300/450?random=14',
    quality: '4K' as '4K' | 'HD' | 'SD',
  },
  {
    id: 'recommended3',
    title: 'Titan\'s Shadow',
    posterUrl: 'https://picsum.photos/300/450?random=15',
    quality: 'HD' as 'HD' | '4K' | 'SD',
    isNew: true,
  },
  {
    id: 'recommended4',
    title: 'Desert Wind',
    posterUrl: 'https://picsum.photos/300/450?random=16',
    quality: 'HD' as 'HD' | '4K' | 'SD',
  },
  {
    id: 'recommended5',
    title: 'Frozen Echo',
    posterUrl: 'https://picsum.photos/300/450?random=1',
    quality: '4K' as '4K' | 'HD' | 'SD',
  },
  {
    id: 'recommended6',
    title: 'Quantum Break',
    posterUrl: 'https://picsum.photos/300/450',
    quality: 'HD' as 'HD' | '4K' | 'SD',
  },
];

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <HeroBanner items={heroItems} />
      
      {/* Content Sections */}
      <div className="relative z-10 -mt-12">
        {/* Continue Watching */}
        <ContentRow 
          title="Continue Watching"
          items={continueWatchingItems} 
          aspectRatio="16:9"
        />
        
        {/* Trending Now */}
        <ContentRow 
          title="Trending Now"
          items={trendingNowItems} 
          aspectRatio="2:3"
          seeMoreHref="/trending"
        />
        
        {/* Recommended For You */}
        <ContentRow 
          title="Recommended For You"
          items={recommendedItems} 
          aspectRatio="2:3"
          seeMoreHref="/recommended"
        />
      </div>
    </>
  );
}
