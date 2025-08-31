
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MonthSelection } from '../types/budget';
import { useStyles } from '../styles/commonStyles';
import Icon from './Icon';

interface MonthSelectorProps {
  availableMonths: MonthSelection[];
  selectedMonth: MonthSelection | null;
  onMonthSelect: (month: MonthSelection) => void;
  onClose: () => void;
}

export default function MonthSelector({
  availableMonths,
  selectedMonth,
  onMonthSelect,
  onClose
}: MonthSelectorProps) {
  const { colors, commonStyles } = useStyles();

  return (
    <View style={styles.overlay}>
      <View style={[styles.modal, { backgroundColor: colors.card }]}>
        <View style={[commonStyles.row, { marginBottom: 20 }]}>
          <Text style={[commonStyles.title, { color: colors.text }]}>
            Sélectionner le mois
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Icon name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {availableMonths.map((month) => (
            <TouchableOpacity
              key={`${month.year}-${month.month}`}
              style={[
                styles.monthItem,
                {
                  backgroundColor: selectedMonth?.month === month.month && selectedMonth?.year === month.year
                    ? colors.primary + '20'
                    : colors.backgroundAlt,
                  borderColor: selectedMonth?.month === month.month && selectedMonth?.year === month.year
                    ? colors.primary
                    : colors.border,
                }
              ]}
              onPress={() => onMonthSelect(month)}
            >
              <Text style={[
                styles.monthText,
                {
                  color: selectedMonth?.month === month.month && selectedMonth?.year === month.year
                    ? colors.primary
                    : colors.text,
                  fontWeight: selectedMonth?.month === month.month && selectedMonth?.year === month.year
                    ? '600'
                    : '400',
                }
              ]}>
                {month.displayName}
              </Text>
              
              {selectedMonth?.month === month.month && selectedMonth?.year === month.year && (
                <Icon name="checkmark-circle" size={20} color={colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '70%',
  },
  monthItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
  },
  monthText: {
    fontSize: 16,
  },
});
