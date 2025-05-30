# Prime Video-like Video Streaming Platform - Landing Page

## Project Overview
This is the landing page for a video streaming platform as similar as possible to Prime Video. It provides users with an intuitive interface to browse, search, and watch video content.

## Features

### Video Display
- **Featured Content**: Showcase trending and popular videos
- **Categorized Sections**: Browse videos by genre, category, or collections
- **Responsive Grid**: Adaptable layout for various screen sizes
- **Preview Thumbnails**: Hover effects showing video previews

### Search Functionality
- **Real-time Search**: Instant results as users type
- **Advanced Filters**: Filter by genre, release date, and popularity
- **Search History**: Track recent searches for quick access
- **Suggested Results**: AI-powered content recommendations

### Video Player
- **Adaptive Streaming**: Adjusts quality based on connection speed
- **Playback Controls**: Play/pause, volume, fullscreen, and skip options
- **Progress Tracking**: Remember watch progress across sessions, Persistent storage (e.g., localStorage). Loading saved progress when the video loads.
- **Subtitle Support**: Multiple language captions

### Metadata Display
- **Detailed Information**: Title, description, cast, and release date
- **User Ratings**: Display average ratings and user reviews
- **Related Content**: Suggestions for similar videos
- **Share Options**: Easy sharing to social media platforms

## Tech Stack
- **Frontend**: Next.js with React
- **Styling**: Emotion UI
- **State Management**: React Context API
- **Data Fetching**: React Query
- **Video Playback**: Video.js with HLS support
- **Mocking**: Mock Service Worker (MSW)
- **Package Manager**: pnpm
- **TypeScript**: Yes

## API Endpoints

### Video Management
- `GET /api/videos/{id}` - Get video details by ID
- `GET /api/videos` - List all videos with pagination and filtering

### Video Streaming
- `GET /api/videos/{id}/stream` - Stream video in HLS format
- `GET /api/videos/{id}/subtitles/{language}` - Get subtitles
- `GET /api/videos/{id}/subtitles` - Get all available subtitles


## UX/UI Best Practices for Video Streaming Landing Page
### Core Elements
Hero Banner: Dynamic carousel with auto-playing video previews and direct CTA buttons
Content Rows: Horizontal-scrolling categories with varying card sizes for content hierarchy
Smart Navigation: Minimal sticky header with intelligent search functionality
Personalized Experience: "Continue Watching" section always first for returning users

### Card Design
Progressive Disclosure: Minimal info by default, expanding on hover with ratings, duration, and quality badges
Visual Indicators: Progress bars for partially watched content and "New" badges for recent additions
Quick Actions: One-click play and add-to-watchlist buttons directly on content cards

### Responsive Considerations
Adaptive Layouts: Seamless experience across desktop, tablet, and mobile devices
Touch Optimization: Larger tap targets on mobile with bottom navigation for thumb accessibility
Performance Focus: Lazy loading content with skeleton screens during data fetching

### Accessibility
Clear Focus States: Visible keyboard navigation indicators following brand colors
High Contrast Text: Minimum 4.5:1 ratio against backgrounds for readability
Reduced Motion Option: Settings for users with motion sensitivity

This streamlined approach prioritizes user engagement while maintaining performance across all devices and accessibility standards.

### Visual Design (UI)

#### Color Scheme

- Dominantly dark theme: deep navy and black tones for backgrounds
- Contrasting white and light gray fonts
- Highlight colors: Blue (for selected content), Yellow (Prime branding), occasional use of red/orange for urgency (like rentals expiring soon)

#### Typography

- Clean, modern sans-serif fonts
- Hierarchy is clear — large bold titles for featured shows, smaller text for metadata like rating, duration, year

#### Layout

- Grid-based with horizontal carousels (e.g., "Continue Watching", "Recommended", etc.)
- Cards are used extensively with rounded corners and subtle shadows

#### Imagery

- Poster-heavy interface, using high-quality thumbnails as the main visual cues
- Banner heroes for originals and promoted content

## Getting Started

### Prerequisites
- Node.js (version 18.x or later)
- npm or yarn or pnpm

### Installation
```bash
# Navigate to the landing-page directory
cd landing-page

# Install dependencies
npm install
# or
yarn install
# or
pnpm install

# Start development server
npm run dev
# or
yarn dev
# or
pnpm dev
``` 

### Environment Variables
Create a `.env.local` file in the root directory with the following variables:
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Project Structure
```
├── components/       # Reusable UI components
│   ├── ui/           # Basic UI elements
│   ├── layout/       # Layout components
│   ├── video/        # Video player and related components
│   └── search/       # Search components
├── hooks/            # Custom React hooks
├── pages/            # Next.js pages and API routes
├── public/           # Static assets
├── styles/           # Global styles and Emotion UI config
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## Future Enhancements
- User authentication and profiles
- Personalized recommendations
- Watchlist functionality
- Mobile app integration
