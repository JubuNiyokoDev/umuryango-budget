import React from 'react';
import { View, Text } from 'react-native';
import { useStyles } from '../styles/commonStyles';

export const StartIOBanner = () => {
  const { colors } = useStyles();
  
  // Placeholder pour Start.io - sera implémenté avec le bridge natif
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
      <Text style={{ color: colors.primary, fontSize: 12 }}>Start.io Ad Space</Text>
    </View>
  );
};