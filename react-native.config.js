module.exports = {
  dependencies: {
    'react-native-google-mobile-ads': {
      platforms: {
        android: {
          sourceDir: '../node_modules/react-native-google-mobile-ads/android/',
          packageImportPath: 'io.invertase.googlemobileads.ReactNativeGoogleMobileAdsPackage',
        },
      },
    },
  },
};