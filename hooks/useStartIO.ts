import { NativeModules } from 'react-native';
import { StartIOConfig } from '../config/startio';

const { StartIOModule } = NativeModules;

export const useStartIO = () => {
  const initialize = () => {
    if (StartIOModule) {
      StartIOModule.initialize(StartIOConfig.appId);
    }
  };

  const showInterstitial = () => {
    if (StartIOModule) {
      StartIOModule.showInterstitial();
    }
  };
  
  const showRewardedVideo = () => {
    if (StartIOModule) {
      StartIOModule.showRewardedVideo();
    }
  };
  
  const loadNativeAd = () => {
    if (StartIOModule) {
      StartIOModule.loadNativeAd();
    }
  };

  return {
    initialize,
    showInterstitial,
    showRewardedVideo,
    loadNativeAd,
  };
};