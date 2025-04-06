'use client';

import { AppProviders } from "@/context/AppProviders";
import { mockVideos } from "@/mocks/mockData";
import { useEffect } from 'react';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Initialize MSW
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      import('@/mocks/browser').then(({ worker }) => {
        worker.start({
          onUnhandledRequest: 'bypass'
        });
      });
    }
  }, []);

  return (
    <AppProviders initialVideos={mockVideos}>
      {children}
    </AppProviders>
  );
}
