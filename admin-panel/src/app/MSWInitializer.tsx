'use client';

import { useEffect } from 'react';
import { initMSW } from './mswInit';

/**
 * Component that initializes MSW in client-side environment
 * This is a separate component to avoid importing MSW in the server bundle
 */
export function MSWInitializer() {
  // No state needed since we're not using it for rendering
  useEffect(() => {
    const init = async () => {
      await initMSW();
      // We don't need to track initialization state since this component doesn't render anything
      console.log('[MSW] Initialization complete');
    };
    
    init();
  }, []);

  return null; // This component doesn't render anything
}
