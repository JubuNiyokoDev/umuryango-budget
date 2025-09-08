import { useState, useEffect } from 'react';

type AdProvider = 'admob' | 'startio';

export const useAdRotation = () => {
  const [currentProvider, setCurrentProvider] = useState<AdProvider>('startio');

  // Rotation toutes les 30 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProvider(prev => prev === 'admob' ? 'startio' : 'admob');
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return { currentProvider };
};