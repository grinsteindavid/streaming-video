"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background-dark py-2' : 'bg-gradient-to-b from-background-dark to-transparent py-4'}`}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="relative h-10 w-32">
          <span className="text-primary-color font-bold text-2xl">StreamFlix</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-text-primary hover:text-primary-color transition-colors">
            Home
          </Link>
          <Link href="/movies" className="text-text-primary hover:text-primary-color transition-colors">
            Movies
          </Link>
          <Link href="/tv-shows" className="text-text-primary hover:text-primary-color transition-colors">
            TV Shows
          </Link>
          <Link href="/categories" className="text-text-primary hover:text-primary-color transition-colors">
            Categories
          </Link>
          <Link href="/watchlist" className="text-text-primary hover:text-primary-color transition-colors">
            My List
          </Link>
        </nav>
        
        {/* Search Bar */}
        <div className="hidden md:flex items-center relative flex-1 max-w-xs mx-6">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background-light bg-opacity-50 text-text-primary placeholder-text-secondary rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-primary-color"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21 21L15.5 15.5M15.5 15.5C17.0913 13.9087 18 11.7565 18 9.5C18 7.24349 17.0913 5.09124 15.5 3.5C13.9087 1.90876 11.7565 1 9.5 1C7.24349 1 5.09124 1.90876 3.5 3.5C1.90876 5.09124 1 7.24349 1 9.5C1 11.7565 1.90876 13.9087 3.5 15.5C5.09124 17.0913 7.24349 18 9.5 18C11.7565 18 13.9087 17.0913 15.5 15.5Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        
        {/* User Menu */}
        <div className="flex items-center space-x-4">
          <button className="text-text-primary hover:text-primary-color transition-colors">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 17H9V21H15V17Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M20 17H15V21H20V17Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 17H4V21H9V17Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5 3L12 10L19 3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 10V21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          
          <button className="text-text-primary hover:text-primary-color transition-colors">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          
          <div className="relative">
            <button 
              className="flex items-center focus:outline-none"
              onClick={() => {}}
            >
              <div className="h-8 w-8 rounded-full bg-primary-color overflow-hidden flex items-center justify-center text-text-primary">
                <span>U</span>
              </div>
            </button>
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-text-primary hover:text-primary-color transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMobileMenuOpen ? (
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : (
                <path
                  d="M3 12H21M3 6H21M3 18H21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <nav className="md:hidden bg-background-dark py-4 px-4">
          <div className="flex items-center relative mb-4">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background-light bg-opacity-50 text-text-primary placeholder-text-secondary rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-primary-color"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 21L15.5 15.5M15.5 15.5C17.0913 13.9087 18 11.7565 18 9.5C18 7.24349 17.0913 5.09124 15.5 3.5C13.9087 1.90876 11.7565 1 9.5 1C7.24349 1 5.09124 1.90876 3.5 3.5C1.90876 5.09124 1 7.24349 1 9.5C1 11.7565 1.90876 13.9087 3.5 15.5C5.09124 17.0913 7.24349 18 9.5 18C11.7565 18 13.9087 17.0913 15.5 15.5Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          
          <div className="flex flex-col space-y-3">
            <Link 
              href="/" 
              className="text-text-primary hover:text-primary-color transition-colors py-2" 
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/movies" 
              className="text-text-primary hover:text-primary-color transition-colors py-2" 
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Movies
            </Link>
            <Link 
              href="/tv-shows" 
              className="text-text-primary hover:text-primary-color transition-colors py-2" 
              onClick={() => setIsMobileMenuOpen(false)}
            >
              TV Shows
            </Link>
            <Link 
              href="/categories" 
              className="text-text-primary hover:text-primary-color transition-colors py-2" 
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Categories
            </Link>
            <Link 
              href="/watchlist" 
              className="text-text-primary hover:text-primary-color transition-colors py-2" 
              onClick={() => setIsMobileMenuOpen(false)}
            >
              My List
            </Link>
            <hr className="border-background-light" />
            <Link 
              href="/profile" 
              className="text-text-primary hover:text-primary-color transition-colors py-2" 
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Profile
            </Link>
            <Link 
              href="/settings" 
              className="text-text-primary hover:text-primary-color transition-colors py-2" 
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Settings
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
