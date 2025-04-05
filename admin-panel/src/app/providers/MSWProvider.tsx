'use client';

import dynamic from 'next/dynamic';

// Dynamically import the MSW initializer with no SSR
const MSWInitializer = dynamic(
  () => import('@/app/MSWInitializer').then(mod => mod.MSWInitializer), 
  { ssr: false }
);

export function MSWProvider() {
  return <MSWInitializer />;
}
