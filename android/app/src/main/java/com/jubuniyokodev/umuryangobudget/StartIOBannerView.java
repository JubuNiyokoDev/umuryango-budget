package com.jubuniyokodev.umuryangobudget;

import android.content.Context;
import android.widget.LinearLayout;
import com.startapp.sdk.adsbase.StartAppAd;

public class StartIOBannerView extends LinearLayout {
    private StartAppAd startAppAd;

    public StartIOBannerView(Context context) {
        super(context);
        loadAd();
    }

    private void loadAd() {
        startAppAd = new StartAppAd(getContext());
        startAppAd.loadAd();
    }
}