import React from 'react';
import { View, Text } from 'react-native';
import { AdMobConfig } from '../config/admob';

// Fallback si module non disponible
let BannerAd, BannerAdSize;
try {
  const ads = require('react-native-google-mobile-ads');
  BannerAd = ads.BannerAd;
  BannerAdSize = ads.BannerAdSize;
} catch (e) {
  console.log('AdMob module not available, using fallback');
}

export const AdBanner = () => {
  if (BannerAd) {
    return (
      <BannerAd
        unitId={AdMobConfig.bannerId}
        size={BannerAdSize.ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    );
  }
  
  // Fallback placeholder
  return (
    <View style={{ 
      height: 50, 
      backgroundColor: '#f0f0f0', 
      justifyContent: 'center', 
      alignItems: 'center',
      borderRadius: 8,
      margin: 5
    }}>
      <Text style={{ color: '#666', fontSize: 12 }}>AdMob Banner (Build APK for real ads)</Text>
    </View>
  );
};