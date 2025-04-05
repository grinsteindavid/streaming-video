'use client';

/**
 * Client-side MSW initialization
 * This is kept in a separate file to avoid importing MSW in the server bundle
 */
export async function initMSW() {
  if (typeof window === 'undefined') {
    return;
  }

  // Only initialize MSW in development mode
  if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
    const { initMocks } = await import('@/mocks');
    await initMocks();
  }
}
