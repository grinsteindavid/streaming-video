import React from 'react';
import styled from '@emotion/styled';
import Link from 'next/link';
import Image from 'next/image';

const FooterContainer = styled.footer`
  background-color: ${({ theme }) => theme.colors.background.secondary};
  color: ${({ theme }) => theme.colors.text.secondary};
  padding: ${({ theme }) => `${theme.spacing.xl} ${theme.spacing.lg}`};
  margin-top: ${({ theme }) => theme.spacing.xxl};
`;

const FooterContent = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.spacing.xxl};
  padding: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${({ theme }) => theme.spacing.xl};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.lg};
  }
`;

const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const FooterTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const FooterLink = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  text-decoration: none;
  transition: ${({ theme }) => theme.transitions.default};
  cursor: pointer;
  display: block;
  padding: ${({ theme }) => `${theme.spacing.xs} 0`};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  &:hover {
    color: ${({ theme }) => theme.colors.accent.primary};
  }
`;

const BottomFooter = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  text-align: center;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

const SocialLink = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  color: ${({ theme }) => theme.colors.text.primary};
  transition: ${({ theme }) => theme.transitions.default};
  cursor: pointer;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.accent.primary};
  }
`;

const Copyright = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterColumn>
          <FooterTitle>Getting Started</FooterTitle>
          <Link href="/">
            <FooterLink>Home</FooterLink>
          </Link>
          <Link href="/movies">
            <FooterLink>Movies</FooterLink>
          </Link>
          <Link href="/tv-shows">
            <FooterLink>TV Shows</FooterLink>
          </Link>
          <Link href="/categories">
            <FooterLink>Categories</FooterLink>
          </Link>
        </FooterColumn>
        
        <FooterColumn>
          <FooterTitle>Help & Support</FooterTitle>
          <Link href="/not-available">
            <FooterLink>Help Center</FooterLink>
          </Link>
          <Link href="/not-available">
            <FooterLink>Account & Billing</FooterLink>
          </Link>
          <Link href="/not-available">
            <FooterLink>Supported Devices</FooterLink>
          </Link>
          <Link href="/not-available">
            <FooterLink>Accessibility</FooterLink>
          </Link>
        </FooterColumn>
        
        <FooterColumn>
          <FooterTitle>About Us</FooterTitle>
          <Link href="/not-available">
            <FooterLink>About Video</FooterLink>
          </Link>
          <Link href="/not-available">
            <FooterLink>Terms of Use</FooterLink>
          </Link>
          <Link href="/not-available">
            <FooterLink>Privacy Policy</FooterLink>
          </Link>
          <Link href="/not-available">
            <FooterLink>Contact Us</FooterLink>
          </Link>
        </FooterColumn>
        
        <FooterColumn>
          <FooterTitle>Connect With Us</FooterTitle>
          <p style={{ fontSize: '14px' }}>Follow us on social media for news, updates, and exclusive content.</p>
          <SocialLinks>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <SocialLink>
                <span aria-hidden="true">f</span>
              </SocialLink>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <SocialLink>
                <span aria-hidden="true">t</span>
              </SocialLink>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <SocialLink>
                <span aria-hidden="true">i</span>
              </SocialLink>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <SocialLink>
                <span aria-hidden="true">y</span>
              </SocialLink>
            </a>
          </SocialLinks>
        </FooterColumn>
      </FooterContent>
      
      <BottomFooter>
        <Link href="/">
          <Image 
            src="/logo.png" 
            alt=" Video" 
            width={100} 
            height={32} 
          />
        </Link>
        <Copyright>
          &copy; {new Date().getFullYear()}  Video. All Rights Reserved.
        </Copyright>
      </BottomFooter>
    </FooterContainer>
  );
};
