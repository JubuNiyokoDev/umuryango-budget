package com.jubuniyokodev.umuryangobudget;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.startapp.sdk.adsbase.StartAppAd;
import com.startapp.sdk.adsbase.StartAppSDK;

public class StartIOModule extends ReactContextBaseJavaModule {

    public StartIOModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "StartIOModule";
    }

    @ReactMethod
    public void initialize(String appId) {
        StartAppSDK.init(getCurrentActivity(), appId, false);
    }

    @ReactMethod
    public void showInterstitial() {
        StartAppAd startAppAd = new StartAppAd(getCurrentActivity());
        startAppAd.loadAd();
        startAppAd.showAd();
    }
    
    @ReactMethod
    public void showRewardedVideo() {
        StartAppAd rewardedVideo = new StartAppAd(getCurrentActivity());
        rewardedVideo.loadAd();
        rewardedVideo.showAd();
    }
    
    @ReactMethod
    public void loadNativeAd() {
        StartAppAd nativeAd = new StartAppAd(getCurrentActivity());
        nativeAd.loadAd();
    }
}