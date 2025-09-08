import { useEffect, useState } from 'react';
import { InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';
import { AdMobConfig } from '../config/admob';

const interstitial = InterstitialAd.createForAdUnitId(AdMobConfig.interstitialAdId);

export const useInterstitialAd = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const unsubscribe = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      setLoaded(true);
    });

    interstitial.load();

    return unsubscribe;
  }, []);

  const showAd = () => {
    if (loaded) {
      interstitial.show();
      setLoaded(false);
      // Recharger pour la prochaine fois
      interstitial.load();
    }
  };

  return { showAd, loaded };
};