module.exports = {
  dependencies: {
    'react-native-fbads': {
      platforms: {
        android: null, // disable Android platform, other platforms will still autolink if provided
      },
    },
    'react-native-reanimated': {
      platforms: {
        android: null, // disable temporarily to fix C++ linking issues
      },
    },
  },
};