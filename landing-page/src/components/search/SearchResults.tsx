import React from 'react';
import styled from '@emotion/styled';
import { useSearch } from '@/context/SearchContext';
import { Card } from '@/components/ui/Card';
import { Video } from '@/types/video';

const SearchResultsContainer = styled.div<{ isVisible: boolean }>`
  position: absolute;
  top: 60px;
  right: 0;
  width: 400px;
  max-height: 80vh;
  overflow-y: auto;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  z-index: 100;
  display: ${({ isVisible }) => (isVisible ? 'block' : 'none')};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
    left: 0;
  }
`;

const SearchResultsHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SearchResultsTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.accent.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const SearchResultsList = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const NoResults = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const SearchHistory = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const SearchHistoryTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
`;

const SearchHistoryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SearchHistoryItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing.xs} 0`};
  
  &:not(:last-child) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
`;

const HistoryItemText = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  text-align: left;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  
  &:hover {
    color: ${({ theme }) => theme.colors.accent.primary};
  }
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  cursor: pointer;
  
  &:hover {
    color: ${({ theme }) => theme.colors.accent.danger};
  }
`;

const LoadingIndicator = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

interface SearchResultsProps {
  onVideoClick: (video: Video) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ onVideoClick }) => {
  const { 
    searchQuery, 
    searchResults, 
    searchHistory,
    isSearching,
    setSearchQuery,
    clearSearch,
    removeFromSearchHistory 
  } = useSearch();
  
  const isVisible = searchQuery.trim().length > 0 || searchResults.length > 0;
  
  // Handle history item click
  const handleHistoryItemClick = (query: string) => {
    setSearchQuery(query);
  };
  
  // Handle remove history item
  const handleRemoveHistoryItem = (query: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeFromSearchHistory(query);
  };
  
  if (!isVisible) {
    return null;
  }
  
  return (
    <SearchResultsContainer isVisible={isVisible}>
      <SearchResultsHeader>
        <SearchResultsTitle>
          {isSearching ? 'Searching...' : `Results for "${searchQuery}"`}
        </SearchResultsTitle>
        <ClearButton onClick={clearSearch}>Clear</ClearButton>
      </SearchResultsHeader>
      
      {isSearching ? (
        <LoadingIndicator>Searching for videos...</LoadingIndicator>
      ) : searchResults.length > 0 ? (
        <SearchResultsList>
          {searchResults.map((video) => (
            <Card 
              key={video.id} 
              video={video} 
              size="small" 
              onClick={() => onVideoClick(video)}
            />
          ))}
        </SearchResultsList>
      ) : searchQuery.trim() !== '' ? (
        <NoResults>
          <p>No results found for "{searchQuery}"</p>
          <p>Try different keywords or check for typos</p>
        </NoResults>
      ) : null}
      
      {searchHistory.length > 0 && (
        <SearchHistory>
          <SearchHistoryTitle>Recent Searches</SearchHistoryTitle>
          <SearchHistoryList>
            {searchHistory.map((item, index) => (
              <SearchHistoryItem key={index}>
                <HistoryItemText 
                  onClick={() => handleHistoryItemClick(item.query)}
                >
                  {item.query}
                </HistoryItemText>
                <RemoveButton 
                  onClick={(e) => handleRemoveHistoryItem(item.query, e)}
                  aria-label={`Remove ${item.query} from search history`}
                >
                  ✕
                </RemoveButton>
              </SearchHistoryItem>
            ))}
          </SearchHistoryList>
        </SearchHistory>
      )}
    </SearchResultsContainer>
  );
};
