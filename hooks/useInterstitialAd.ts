export const useInterstitialAd = () => {
  // Temporairement désactivé pour Expo
  const showAd = () => {
    // Ne fait rien en mode Expo
  };

  return { showAd, loaded: false };
};