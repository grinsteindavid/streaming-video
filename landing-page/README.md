# Prime Video-like Video Streaming Platform - Landing Page

## Project Overview
This is the landing page for a video streaming platform similar to Prime Video. It provides users with an intuitive interface to browse, search, and watch video content.

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
- **Progress Tracking**: Remember watch progress across sessions
- **Subtitle Support**: Multiple language captions

### Metadata Display
- **Detailed Information**: Title, description, cast, and release date
- **User Ratings**: Display average ratings and user reviews
- **Related Content**: Suggestions for similar videos
- **Share Options**: Easy sharing to social media platforms

## Tech Stack
- **Frontend**: Next.js with React
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Data Fetching**: React Query
- **Video Playback**: Video.js with HLS support
- **Package Manager**: pnpm
- **TypeScript**: Yes

## Getting Started

### Prerequisites
- Node.js (version 18.x or later)
- npm or yarn or pnpm

### Installation
```bash
# Navigate to the admin-panel directory
cd admin-panel

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
pnpm de

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
├── styles/           # Global styles and Tailwind config
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## Future Enhancements
- User authentication and profiles
- Personalized recommendations
- Watchlist functionality
- Mobile app integration
