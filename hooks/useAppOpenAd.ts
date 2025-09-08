import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { AppOpenAd, TestIds, AdEventType } from 'react-native-google-mobile-ads';

import { AdMobConfig } from '../config/admob';

const adUnitId = AdMobConfig.appOpenId;

export const useAppOpenAd = () => {
  const [appOpenAd, setAppOpenAd] = useState<AppOpenAd | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
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
  }, []);

  const showAppOpenAd = () => {
    if (loaded && appOpenAd) {
      appOpenAd.show();
    }
  };

  return { showAppOpenAd, loaded };
};