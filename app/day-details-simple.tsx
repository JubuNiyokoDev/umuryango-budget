import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useStyles } from '../styles/commonStyles';
import Icon from '../components/Icon';

interface DayDetailsProps {
  selectedDate: string | null;
  onBack: () => void;
}

export default function DayDetailsScreen({ selectedDate, onBack }: DayDetailsProps) {
  const { colors, commonStyles } = useStyles();

  return (
    <View style={[commonStyles.container, { backgroundColor: colors.background }]}>
      <View style={commonStyles.content}>
        <View style={[commonStyles.row, { marginBottom: 20 }]}>
          <TouchableOpacity onPress={onBack}>
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[commonStyles.title, { color: colors.text }]}>
            Détails du jour
          </Text>
        </View>
        
        <View style={[commonStyles.card, { backgroundColor: colors.card }]}>
          <Text style={[commonStyles.subtitle, { color: colors.text }]}>
            Date sélectionnée: {selectedDate}
          </Text>
          <Text style={{ color: colors.textSecondary, marginTop: 10 }}>
            Fonctionnalité en cours de développement...
          </Text>
        </View>
      </View>
    </View>
  );
}