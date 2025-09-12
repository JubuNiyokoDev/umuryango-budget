import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

let BannerAd: any = null;
let TestIds: any = null;

try {
  const { BannerAd: BA, TestIds: TI } = require('react-native-google-mobile-ads');
  BannerAd = BA;
  TestIds = TI;
} catch (error) {
  console.log('Google Mobile Ads not available:', error);
}

export const AdBanner = () => {
  const [adError, setAdError] = useState(false);

  if (!BannerAd || adError) {
    return null;
  }

  return (
    <View style={{ alignItems: 'center', marginVertical: 10 }}>
      <BannerAd
        unitId={__DEV__ ? TestIds.BANNER : 'ca-app-pub-2300546388710165/8234567890'}
        size="banner"
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdFailedToLoad={(error: any) => {
          console.log('Banner ad failed to load:', error);
          setAdError(true);
        }}
      />
    </View>
  );
};