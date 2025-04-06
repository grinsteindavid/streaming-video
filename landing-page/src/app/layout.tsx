import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StreamFlix | Your Premium Video Streaming Platform",
  description: "Stream your favorite movies, TV shows, and documentaries. Enjoy the latest releases and classic titles in HD and 4K quality.",
  keywords: "video streaming, movies, TV shows, documentaries, HD streaming, premium content",
  authors: [{ name: "StreamFlix Team" }],
  openGraph: {
    title: "StreamFlix | Your Premium Video Streaming Platform",
    description: "Stream your favorite movies, TV shows, and documentaries in HD and 4K quality.",
    url: "https://streamflix.example.com",
    siteName: "StreamFlix",
    images: [
      {
        url: "https://streamflix.example.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "StreamFlix - Premium Video Streaming",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StreamFlix | Your Premium Video Streaming Platform",
    description: "Stream your favorite movies, TV shows, and documentaries in HD and 4K quality.",
    images: ["https://streamflix.example.com/twitter-image.jpg"],
    creator: "@streamflix",
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.json",
};

import Navbar from '../components/layout/navbar';
import { UserProvider } from '../context/user-context';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <UserProvider>
          <Navbar />
          <main className="pt-16">
            {children}
          </main>
        </UserProvider>
      </body>
    </html>
  );
}
