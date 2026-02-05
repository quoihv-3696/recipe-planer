/**
 * ClientProvider Component
 * 
 * Client-side initialization wrapper for data hydration
 */

'use client';

import { useEffect, useState, ReactNode } from 'react';
import { initializeData } from '@/lib/storage/initializer';
import { ErrorBoundary } from './ErrorBoundary';

export function ClientProvider({ children }: { children: ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    const init = async () => {
      try {
        await initializeData();
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize data:', error);
        setIsInitialized(true); // Continue even if initialization fails
      }
    };
    
    init();
  }, []);
  
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
}
