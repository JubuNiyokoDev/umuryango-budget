import React from 'react';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { AdMobConfig } from '../config/admob';

export const AdBanner = () => {
  return (
    <BannerAd
      unitId={AdMobConfig.bannerId}
      size={BannerAdSize.ADAPTIVE_BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
    />
  );
};