/**
 * Mock service worker initialization for the browser
 */

async function initMocks() {
  if (typeof window === 'undefined') {
    return;
  }

  // Only enable MSW in development
  if (process.env.NODE_ENV === 'development') {
    try {
      const { worker } = await import('./browser');
      await worker.start({
        onUnhandledRequest: 'bypass', // Don't warn on unhandled requests (like static assets)
      });
      console.log('%c[MSW] Mocks enabled', 'color: #00b894; font-weight: bold;');
    } catch (error) {
      console.error('Error starting MSW worker:', error);
    }
  }
}

export { initMocks };
