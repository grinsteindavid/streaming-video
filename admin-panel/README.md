# Video Streaming Admin Panel

## Project Overview
This is an administrative dashboard for a video streaming platform similar to Netflix. The admin panel enables content managers to upload, manage, and analyze video content that will be served to end users.

## Features

### Content Management
- **Video Upload**: Easily upload video files with progress tracking
- **Batch Operations**: Perform actions on multiple videos simultaneously
- **Media Library**: Browse and manage all uploaded content

### Search and Filtering
- **Advanced Search**: Find content using multiple criteria
- **Filtering Options**: Filter by upload date, category, tags, and popularity
- **Sorting**: Sort content by various metrics

### Analytics and Statistics
- **View Counts**: Track how many times each video has been viewed
- **Engagement Metrics**: Monitor like/dislike ratios and user engagement
- **Performance Dashboard**: Visual representation of content performance

### Metadata Management
- **Basic Metadata**: Add and edit titles, descriptions, and release dates
- **Categorization**: Assign categories and genres to content
- **Tagging System**: Apply and manage tags for improved searchability

## Tech Stack
- **Frontend**: Next.js with React
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Data Fetching**: React Query
- **Analytics**: Chart.js with React Chart.js 2
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
├── contexts/         # React context for state management
├── hooks/            # Custom React hooks
├── pages/            # Next.js pages and API routes
├── public/           # Static assets
├── styles/           # Global styles and Tailwind config
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## API Integration
The admin panel connects to the video streaming API for data operations. API endpoints are documented separately in the API documentation.

## Future Enhancements
- User authentication and role-based access control
- Content scheduling and publishing workflow
- Advanced analytics and reporting
- User feedback management
