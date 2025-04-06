import React from 'react';
import styled from '@emotion/styled';
import { Navigation } from './Navigation';
import { Footer } from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
  transparentHeader?: boolean;
}

const Main = styled.main`
  min-height: 100vh;
  padding-top: 64px; /* Height of the navigation bar */
`;

export const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  transparentHeader = false 
}) => {
  return (
    <>
      <Navigation transparent={transparentHeader} />
      <Main>{children}</Main>
      <Footer />
    </>
  );
};
