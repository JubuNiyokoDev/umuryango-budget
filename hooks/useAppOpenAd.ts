import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

// Import protégé pour AdMob
let AppOpenAd: any = null;
let AdEventType: any = null;
let adUnitId: string = '';

try {
  const admob = require('react-native-google-mobile-ads');
  AppOpenAd = admob.AppOpenAd;
  AdEventType = admob.AdEventType;
  const { AdMobConfig } = require('../config/admob');
  adUnitId = AdMobConfig.appOpenId;
} catch (error) {
  console.log('Google Mobile Ads not available:', error);
}

export const useAppOpenAd = () => {
  const [appOpenAd, setAppOpenAd] = useState<any>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!AppOpenAd || !AdEventType || !adUnitId) {
      console.log('AdMob not available for App Open Ad');
      return;
    }
    
    try {
      const appOpen = AppOpenAd.createForAdRequest(adUnitId);
    
    const unsubscribeLoaded = appOpen.addAdEventListener(AdEventType.LOADED, () => {
      setLoaded(true);
    });

    const unsubscribeClosed = appOpen.addAdEventListener(AdEventType.CLOSED, () => {
      setLoaded(false);
      // Reload for next time
      appOpen.load();
    });

    appOpen.load();
    setAppOpenAd(appOpen);

    // Show ad when app comes to foreground
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active' && loaded) {
        appOpen.show();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

      return () => {
        unsubscribeLoaded();
        unsubscribeClosed();
        subscription?.remove();
      };
    } catch (error) {
      console.log('App Open Ad initialization failed:', error);
    }
  }, []);

  const showAppOpenAd = () => {
    if (loaded && appOpenAd) {
      appOpenAd.show();
    }
  };

  return { showAppOpenAd, loaded };
};