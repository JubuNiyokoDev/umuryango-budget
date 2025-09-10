import React from 'react';
import { View } from 'react-native';
import { NativeAd, NativeAdView as RNNativeAdView, HeadlineView, TaglineView, AdvertiserView, CallToActionView, IconView } from 'react-native-google-mobile-ads';
import { AdMobConfig } from '../config/admob';
import { useStyles } from '../styles/commonStyles';

export const NativeAdView = () => {
  const { colors } = useStyles();

  return (
    <NativeAd unitId={AdMobConfig.nativeId}>
      <RNNativeAdView style={{
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 16,
        margin: 8,
        borderWidth: 1,
        borderColor: colors.border
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <IconView style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            marginRight: 12
          }} />
          <View style={{ flex: 1 }}>
            <HeadlineView style={{ color: colors.text, fontWeight: '600', fontSize: 14 }} />
            <AdvertiserView style={{ color: colors.textSecondary, fontSize: 12 }} />
          </View>
        </View>
        <TaglineView style={{ color: colors.text, fontSize: 13, lineHeight: 18, marginBottom: 12 }} />
        <CallToActionView style={{
          backgroundColor: colors.primary,
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 6,
          alignSelf: 'flex-start'
        }} />
      </RNNativeAdView>
    </NativeAd>
  );
};