import React from 'react';
import { View, Text } from 'react-native';
import { useStyles } from '../styles/commonStyles';

export const StartIOBanner = () => {
  const { colors } = useStyles();

  return (
    <View style={{ 
      height: 50, 
      backgroundColor: colors.card, 
      justifyContent: 'center', 
      alignItems: 'center',
      borderRadius: 8,
      margin: 5,
      borderWidth: 1,
      borderColor: colors.border
    }}>
      <Text style={{ color: colors.text, fontSize: 12 }}>Start.io Banner</Text>
    </View>
  );
};