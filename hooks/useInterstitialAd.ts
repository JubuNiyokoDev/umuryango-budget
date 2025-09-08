export const useInterstitialAd = () => {
  const showAd = () => {
    // Temporairement désactivé - rebuild natif requis
    console.log('Interstitial ad would show here');
  };

  return { showAd, loaded: false };
};