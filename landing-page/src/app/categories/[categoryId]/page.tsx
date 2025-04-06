'use client';

import React, { useEffect, useState, use } from 'react';
import styled from '@emotion/styled';
import { MainLayout } from '@/components/layout/MainLayout';
import { VideoGrid } from '@/components/video/VideoGrid';
import { useVideos, useVideoCategories } from '@/hooks/useVideos';
import { VideoCategory } from '@/types/video';
import Link from 'next/link';

const PageContainer = styled.div`
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
  }
`;

const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  text-decoration: none;
  transition: color 0.2s ease;
  
  &:hover {
    color: ${({ theme }) => theme.colors.accent.primary};
  }
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSizes.xxl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const VideoCount = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

interface CategoryPageProps {
  params: {
    categoryId: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  // In Next.js 15.2.4, params is a Promise that needs to be unwrapped
  // We need to cast it to the correct type after unwrapping
  const unwrappedParams = use(params as any) as { categoryId: string };
  const categoryId = unwrappedParams.categoryId;
  const [category, setCategory] = useState<VideoCategory | null>(null);
  
  // Fetch all categories
  const { data: categories = [], isLoading: isCategoriesLoading } = useVideoCategories();
  
  // Find the current category
  useEffect(() => {
    if (categories.length > 0 && categoryId) {
      const foundCategory = categories.find((cat: VideoCategory) => cat.id === categoryId);
      if (foundCategory) {
        setCategory(foundCategory);
      }
    }
  }, [categories, categoryId]);
  
  // Loading state
  if (isCategoriesLoading || !category) {
    return (
      <MainLayout>
        <PageContainer>
          <p>Loading category...</p>
        </PageContainer>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <PageContainer>
        <PageHeader>
          <BackLink href="/categories">← Back to Categories</BackLink>
          <PageTitle>{category.name}</PageTitle>
          <VideoCount>{category.videos.length} videos</VideoCount>
        </PageHeader>
        
        <VideoGrid videos={category.videos} />
      </PageContainer>
    </MainLayout>
  );
}
