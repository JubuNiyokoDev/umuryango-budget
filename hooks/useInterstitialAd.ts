import { useEffect, useState } from 'react';
import { AdMobConfig } from '../config/admob';

// Fallback si module non disponible
let InterstitialAd, AdEventType;
try {
  const ads = require('react-native-google-mobile-ads');
  InterstitialAd = ads.InterstitialAd;
  AdEventType = ads.AdEventType;
} catch (e) {
  console.log('AdMob module not available, using fallback');
}

export const useInterstitialAd = () => {
  const [interstitialAd, setInterstitialAd] = useState<InterstitialAd | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!InterstitialAd) return;
    
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
    } else {
      console.log('Interstitial ad would show here (Build APK for real ads)');
    }
  };

  return { showAd, loaded };
};