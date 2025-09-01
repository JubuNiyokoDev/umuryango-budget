
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useStyles } from '../styles/commonStyles';
import { useTranslation } from '../hooks/useTranslation';

interface BudgetChartProps {
  totalBudget: number;
  consumedBudget: number;
  currency: string;
}

export default function BudgetChart({ totalBudget, consumedBudget, currency }: BudgetChartProps) {
  const { colors } = useStyles();
  const { t } = useTranslation();

  const percentage = totalBudget > 0 ? (consumedBudget / totalBudget) * 100 : 0;
  const remainingBudget = totalBudget - consumedBudget;

  const getColor = () => {
    if (percentage >= 90) return colors.error;
    if (percentage >= 70) return colors.warning;
    return colors.success;
  };

  const strokeWidth = 8;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        {/* Background circle */}
        <View style={[styles.circle, { borderColor: colors.border }]} />
        
        {/* Progress circle */}
        <View 
          style={[
            styles.circle,
            styles.progressCircle,
            {
              borderColor: getColor(),
              borderWidth: strokeWidth,
              transform: [
                { rotate: '-90deg' },
                { 
                  scaleX: percentage > 0 ? 1 : 0 
                }
              ],
            }
          ]}
        />
        
        {/* Center content */}
        <View style={styles.centerContent}>
          <Text style={[styles.percentageText, { color: getColor() }]}>
            {Math.round(percentage)}%
          </Text>
          <Text style={[styles.labelText, { color: colors.textSecondary }]}>
            {t('consumedLabel')}
          </Text>
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>
            {t('consumedLabel')}: {consumedBudget.toLocaleString()} {currency}
          </Text>
        </View>
        
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.border }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>
            {t('remainingLabel')}: {remainingBudget.toLocaleString()} {currency}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  chartContainer: {
    position: 'relative',
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
  },
  progressCircle: {
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: 'transparent',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageText: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  labelText: {
    fontSize: 12,
    fontWeight: '500',
  },
  legend: {
    marginTop: 20,
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
  },
});
