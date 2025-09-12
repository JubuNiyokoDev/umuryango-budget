export const useRewardedAd = () => {
  // Temporairement désactivé pour Expo
  const showRewardedAd = () => {
    // Ne fait rien en mode Expo
  };

  return { showRewardedAd, loaded: false };
};