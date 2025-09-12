import React from 'react';
import { View, Text } from 'react-native';
import { useStyles } from '../styles/commonStyles';

export const NativeAdView = () => {
  const { colors } = useStyles();

  // Placeholder component - replace with correct ad implementation when library is properly configured
  return (
    <View style={{
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      margin: 8,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center'
    }}>
      <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
        Publicité
      </Text>
    </View>
  );
};