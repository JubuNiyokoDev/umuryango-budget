import { useEffect, useState } from 'react';
import { InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';
import { AdMobConfig } from '../config/admob';

export const useInterstitialAd = () => {
  const [interstitialAd, setInterstitialAd] = useState<InterstitialAd | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const interstitial = InterstitialAd.createForAdRequest(AdMobConfig.interstitialId);
    
    const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      setLoaded(true);
    });

    const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      setLoaded(false);
      interstitial.load();
    });

    interstitial.load();
    setInterstitialAd(interstitial);

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
    };
  }, []);

  const showAd = () => {
    if (loaded && interstitialAd) {
      interstitialAd.show();
    }
  };

  return { showAd, loaded };
};