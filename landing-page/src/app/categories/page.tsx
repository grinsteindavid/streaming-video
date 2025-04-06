'use client';

import React from 'react';
import styled from '@emotion/styled';
import { MainLayout } from '@/components/layout/MainLayout';
import { Carousel } from '@/components/ui/Carousel';
import { useRouter } from 'next/navigation';
import { useVideoCategories } from '@/hooks/useVideos';
import { Video } from '@/types/video';
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

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSizes.xxl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const CategoryCard = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  height: 200px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
`;

const CategoryOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0.1) 100%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: ${({ theme }) => theme.spacing.md};
`;

const CategoryTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const CategoryCount = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const CategoryImage = styled.div<{ imageUrl: string }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url(${props => props.imageUrl});
  background-size: cover;
  background-position: center;
`;

export default function CategoriesPage() {
  const router = useRouter();
  
  // Fetch video categories
  const { data: videoCategories = [], isLoading: isCategoriesLoading } = useVideoCategories();
  
  // Handle category click
  const handleCategoryClick = (categoryId: string) => {
    router.push(`/categories/${categoryId}`);
  };
  
  // Get a representative image for each category
  const getCategoryImage = (videos: Video[]) => {
    return videos.length > 0 ? videos[0].thumbnailUrl : '';
  };
  
  return (
    <MainLayout>
      <PageContainer>
        <PageTitle>Browse by Category</PageTitle>
        
        {isCategoriesLoading ? (
          <p>Loading categories...</p>
        ) : (
          <CategoryGrid>
            {videoCategories.map((category: any) => (
              <CategoryCard 
                key={category.id} 
                onClick={() => handleCategoryClick(category.id)}
              >
                <CategoryImage imageUrl={getCategoryImage(category.videos)} />
                <CategoryOverlay>
                  <CategoryTitle>{category.name}</CategoryTitle>
                  <CategoryCount>{category.videos.length} videos</CategoryCount>
                </CategoryOverlay>
              </CategoryCard>
            ))}
          </CategoryGrid>
        )}
      </PageContainer>
    </MainLayout>
  );
}
