import React from 'react';
import { View } from 'react-native';
import { AdBanner } from './AdBanner';
import { StartIOBanner } from './StartIOBanner';
import { useAdRotation } from '../hooks/useAdRotation';

export const RotatingAdBanner = () => {
  const { currentProvider } = useAdRotation();

  return (
    <View style={{ marginVertical: 5 }}>
      {currentProvider === 'admob' ? (
        <AdBanner />
      ) : (
        <StartIOBanner />
      )}
    </View>
  );
};