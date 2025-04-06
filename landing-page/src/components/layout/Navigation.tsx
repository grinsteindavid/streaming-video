import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import Link from 'next/link';
import Image from 'next/image';
import { useSearch } from '@/context/SearchContext';

interface NavigationProps {
  transparent?: boolean;
}

const NavContainer = styled.header<{ isScrolled: boolean; transparent: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  transition: all 0.2s ease;
  background-color: ${({ isScrolled, transparent }) =>
    isScrolled || !transparent
      ? '#1a242f'  // Amazon Prime Video's dark background color
      : 'rgba(0, 0, 0, 0.6)'};  // Semi-transparent dark background when not scrolled
  backdrop-filter: ${({ isScrolled }) =>
    isScrolled ? 'blur(8px)' : 'blur(4px)'};
  -webkit-backdrop-filter: ${({ isScrolled }) =>
    isScrolled ? 'blur(8px)' : 'blur(4px)'};
  box-shadow: ${({ isScrolled }) =>
    isScrolled ? '0 1px 8px rgba(0, 0, 0, 0.3)' : 'none'};
  padding: 0;
  height: 72px;
  display: flex;
  align-items: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    height: 60px;
  }
`;

const NavContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 24px;
  height: 100%;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0;
  margin-right: 24px;
  position: relative;
  
  img {
    object-fit: contain;
    max-height: 32px;
  }
`;

const NavLinks = styled.nav`
  display: flex;
  align-items: center;
  height: 100%;
  margin: 0;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const NavLink = styled.span`
  color: #fff;
  font-size: 17px;
  font-weight: 400;
  text-decoration: none;
  transition: color 0.2s ease;
  cursor: pointer;
  padding: 0 16px;
  white-space: nowrap;
  height: 100%;
  display: flex;
  align-items: center;
  position: relative;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);  // Add text shadow for better readability
  
  &:hover {
    color: #fff;
  }
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 16px;
    right: 16px;
    height: 2px;
    background-color: transparent;
    transition: background-color 0.2s ease;
  }
  
  &:hover:after {
    background-color: #fff;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input<{ isExpanded: boolean }>`
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: ${({ theme }) => theme.borderRadius.full};
  color: ${({ theme }) => theme.colors.text.primary};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  width: ${({ isExpanded }) => (isExpanded ? '240px' : '40px')};
  height: 40px;
  transition: ${({ theme }) => theme.transitions.default};
  outline: none;
  
  &:focus {
    border-color: ${({ theme }) => theme.colors.accent.primary};
    width: 240px;
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.secondary};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: ${({ isExpanded }) => (isExpanded ? '100%' : '40px')};
    
    &:focus {
      width: 100%;
    }
  }
`;

const SearchIcon = styled.div<{ isExpanded: boolean }>`
  position: absolute;
  right: ${({ theme }) => theme.spacing.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ isExpanded }) => (isExpanded ? 'default' : 'pointer')};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 24px;
  cursor: pointer;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: block;
  }
`;

const MobileMenu = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
  z-index: 200;
  transform: translateX(${({ isOpen }) => (isOpen ? '0' : '100%')});
  transition: transform 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const MobileMenuHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const MobileMenuLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const MobileMenuLink = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  text-decoration: none;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.sm}`};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: 0.3px;
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
    padding-left: ${({ theme }) => theme.spacing.md};
  }
`;

export const Navigation: React.FC<NavigationProps> = ({ transparent = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { searchQuery, setSearchQuery } = useSearch();
  
  // Handle scroll event to change navigation background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Handle search icon click
  const handleSearchIconClick = () => {
    if (!isSearchExpanded) {
      setIsSearchExpanded(true);
      // Focus the input after expanding
      setTimeout(() => {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
          searchInput.focus();
        }
      }, 100);
    }
  };
  
  // Handle search input blur
  const handleSearchBlur = () => {
    if (searchQuery.trim() === '') {
      setIsSearchExpanded(false);
    }
  };
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  return (
    <>
      <NavContainer isScrolled={isScrolled} transparent={transparent}>
        <NavContent>
          <LogoContainer>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
              <Image 
                src="/logo.png" 
                alt="Prime Video" 
                width={120} 
                height={36} 
                priority 
                style={{ objectFit: 'contain' }}
              />
            </Link>
          </LogoContainer>
          
          <NavLinks>
            <Link href="/">
              <NavLink>Home</NavLink>
            </Link>
            <Link href="/movies">
              <NavLink>Movies</NavLink>
            </Link>
            <Link href="/tv-shows">
              <NavLink>TV Shows</NavLink>
            </Link>
            <Link href="/categories">
              <NavLink>Categories</NavLink>
            </Link>
            <Link href="/watchlist">
              <NavLink>My Stuff</NavLink>
            </Link>
          </NavLinks>
          
          <SearchContainer>
            <SearchInput 
              id="search-input"
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
              onBlur={handleSearchBlur}
              isExpanded={isSearchExpanded}
              aria-label="Search videos"
            />
            <SearchIcon 
              isExpanded={isSearchExpanded} 
              onClick={handleSearchIconClick}
              aria-hidden="true"
            >
              🔍
            </SearchIcon>
          </SearchContainer>
          
          <MobileMenuButton onClick={toggleMobileMenu} aria-label="Menu">
            ☰
          </MobileMenuButton>
        </NavContent>
      </NavContainer>
      
      <MobileMenu isOpen={isMobileMenuOpen}>
        <MobileMenuHeader>
          <Image 
            src="/logo.png" 
            alt="Prime Video" 
            width={100} 
            height={32} 
          />
          <button 
            onClick={toggleMobileMenu} 
            aria-label="Close menu"
            style={{ background: 'none', border: 'none', color: 'white', fontSize: '24px' }}
          >
            ✕
          </button>
        </MobileMenuHeader>
        
        <SearchContainer style={{ marginBottom: '24px', width: '100%' }}>
          <SearchInput 
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchChange}
            isExpanded={true}
            style={{ width: '100%' }}
            aria-label="Search videos"
          />
          <SearchIcon isExpanded={true} aria-hidden="true">
            🔍
          </SearchIcon>
        </SearchContainer>
        
        <MobileMenuLinks>
          <Link href="/">
            <MobileMenuLink onClick={toggleMobileMenu}>Home</MobileMenuLink>
          </Link>
          <Link href="/movies">
            <MobileMenuLink onClick={toggleMobileMenu}>Movies</MobileMenuLink>
          </Link>
          <Link href="/tv-shows">
            <MobileMenuLink onClick={toggleMobileMenu}>TV Shows</MobileMenuLink>
          </Link>
          <Link href="/categories">
            <MobileMenuLink onClick={toggleMobileMenu}>Categories</MobileMenuLink>
          </Link>
          <Link href="/watchlist">
            <MobileMenuLink onClick={toggleMobileMenu}>My Stuff</MobileMenuLink>
          </Link>
        </MobileMenuLinks>
      </MobileMenu>
    </>
  );
};
