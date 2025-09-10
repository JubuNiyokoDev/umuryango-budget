import { useEffect, useState } from 'react';
import { RewardedAd, RewardedAdEventType, TestIds } from 'react-native-google-mobile-ads';

const adUnitId = AdMobConfig.rewardedId;

export const useRewardedAd = () => {
  const [loaded, setLoaded] = useState(false);
  const [rewarded, setRewarded] = useState<RewardedAd | null>(null);

  useEffect(() => {
    const rewardedAd = RewardedAd.createForAdRequest(adUnitId);
    
    const unsubscribeLoaded = rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
      setLoaded(true);
    });

    const unsubscribeEarned = rewardedAd.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      reward => {
        console.log('User earned reward of ', reward);
      },
    );

    rewardedAd.load();
    setRewarded(rewardedAd);

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, []);

  const showRewardedAd = () => {
    if (loaded && rewarded) {
      rewarded.show();
      setLoaded(false);
      // Reload for next time
      rewarded.load();
    }
  };

  return { showRewardedAd, loaded };
};