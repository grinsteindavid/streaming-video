import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { QueryProvider } from "@/contexts/QueryProvider";
import { MSWProvider } from './providers/MSWProvider';
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
  title: "Video Streaming Admin Panel",
  description: "Administrative dashboard for managing video streaming content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Initialize MSW for API mocking in development */}
        <MSWProvider />
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
