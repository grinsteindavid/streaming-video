'use client';

import React from 'react';
import styled from '@emotion/styled';
import { MainLayout } from '@/components/layout/MainLayout';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing.xxl} ${theme.spacing.lg}`};
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSizes.xxl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Message = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  line-height: 1.6;
`;

const BackButton = styled.button`
  background-color: ${({ theme }) => theme.colors.accent.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  margin-top: ${({ theme }) => theme.spacing.lg};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.accent.primary}90;
  }
`;

const NotAvailablePage = () => {
  const router = useRouter();
  
  return (
    <MainLayout>
      <Container>
        <Title>Coming Soon</Title>
        <Message>
          This page is not available in the current MVP version. 
          We're working hard to bring you this feature in a future update.
        </Message>
        <BackButton onClick={() => router.back()}>Go Back</BackButton>
        <Link href="/" style={{ marginTop: '16px', color: '#0073e6', textDecoration: 'none' }}>
          Return to Home
        </Link>
      </Container>
    </MainLayout>
  );
};

export default NotAvailablePage;
