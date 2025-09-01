
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useStyles } from '../styles/commonStyles';
import { DayBudget } from '../types/budget';
import { useTranslation } from '../hooks/useTranslation';
import { translateMonth } from '../utils/dateUtils';

interface CalendarProps {
  month: number;
  year: number;
  days: DayBudget[];
  onDayPress: (date: string) => void;
}

export default function Calendar({ month, year, days, onDayPress }: CalendarProps) {
  const { colors, commonStyles } = useStyles();
  const { t } = useTranslation();

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const formatDate = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getDayBudget = (date: string): DayBudget | null => {
    return days.find(day => day.date === date) || null;
  };

  const getStatusColor = (dayBudget: DayBudget | null, isPast: boolean, isToday: boolean) => {
    if (isToday) {
      return colors.warning; // Orange for today - distinct color
    }

    if (!dayBudget) {
      return isPast ? colors.textSecondary : colors.border;
    }

    if (dayBudget.validated) {
      return colors.success; // Green for validated/paid
    }

    if (dayBudget.status === 'planned') {
      return colors.primary; // Different green for planned
    }

    return colors.border;
  };

  const getSpendingLevelColor = (spendingLevel?: 'low' | 'medium' | 'high') => {
    switch (spendingLevel) {
      case 'high':
        return colors.error;
      case 'medium':
        return colors.warning;
      case 'low':
        return colors.success;
      default:
        return colors.textSecondary;
    }
  };

  const daysInMonth = getDaysInMonth(month, year);
  const firstDay = getFirstDayOfMonth(month, year);
  const today = new Date();
  const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;

  const renderDay = (day: number) => {
    const date = formatDate(day);
    const dayBudget = getDayBudget(date);
    const isToday = isCurrentMonth && today.getDate() === day;
    const isPast = new Date(date) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const statusColor = getStatusColor(dayBudget, isPast, isToday);
    
    // Allow clicking on all days - past days for viewing only, today and future for planning/validation
    const canClick = true;
    
    return (
      <TouchableOpacity
        key={day}
        style={[
          styles.dayButton,
          { 
            borderColor: statusColor,
            backgroundColor: isToday ? colors.warning + '20' : 
                           dayBudget?.validated ? colors.success + '20' :
                           dayBudget?.status === 'planned' ? colors.primary + '20' :
                           colors.backgroundAlt
          },
        ]}
        onPress={() => canClick && onDayPress(date)}
        disabled={!canClick}
      >
        <Text style={[
          styles.dayText,
          { 
            color: isToday ? colors.warning : 
                   dayBudget?.validated ? colors.success :
                   dayBudget?.status === 'planned' ? colors.primary :
                   isPast ? colors.textSecondary : colors.text,
            fontWeight: isToday ? '700' : dayBudget ? '600' : '400'
          },
        ]}>
          {day}
        </Text>
        
        {/* Status indicators */}
        <View style={styles.indicatorContainer}>
          {/* Main status dot */}
          <View style={[
            styles.statusDot,
            { backgroundColor: statusColor }
          ]} />
          
          {/* Spending level indicator */}
          {dayBudget?.spendingLevel && (
            <View style={[
              styles.spendingIndicator,
              { backgroundColor: getSpendingLevelColor(dayBudget.spendingLevel) }
            ]} />
          )}
        </View>

        {/* Amount display for planned/validated days */}
        {dayBudget && dayBudget.total > 0 && (
          <Text style={[
            styles.amountText,
            { color: statusColor }
          ]}>
            {dayBudget.total > 999 
              ? `${Math.round(dayBudget.total / 1000)}k` 
              : dayBudget.total.toString()
            }
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  const renderCalendar = () => {
    const calendar = [];
    const weekDays = [t('sun'), t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat')];
    
    // Week day headers
    calendar.push(
      <View key="headers" style={styles.weekRow}>
        {weekDays.map((day, index) => (
          <View key={index} style={styles.weekDayHeader}>
            <Text style={[styles.weekDayText, { color: colors.textSecondary }]}>{day}</Text>
          </View>
        ))}
      </View>
    );

    // Empty cells for days before the first day of the month
    let week = [];
    for (let i = 0; i < firstDay; i++) {
      week.push(<View key={`empty-${i}`} style={styles.dayButton} />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      week.push(renderDay(day));
      
      if (week.length === 7) {
        calendar.push(
          <View key={`week-${calendar.length}`} style={styles.weekRow}>
            {week}
          </View>
        );
        week = [];
      }
    }

    // Fill the last week with empty cells if needed
    while (week.length < 7 && week.length > 0) {
      week.push(<View key={`empty-end-${week.length}`} style={styles.dayButton} />);
    }
    
    if (week.length > 0) {
      calendar.push(
        <View key={`week-${calendar.length}`} style={styles.weekRow}>
          {week}
        </View>
      );
    }

    return calendar;
  };

  return (
    <View style={[commonStyles.card, { backgroundColor: colors.card }]}>
      <Text style={[commonStyles.subtitle, { color: colors.text }]}>
        {translateMonth(month, t)} {year}
      </Text>
      
      {/* Legend with better color distinction */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>{t('paid')}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.warning }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>{t('today')}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>{t('planned')}</Text>
        </View>
      </View>
      
      {renderCalendar()}
    </View>
  );
}

const styles = StyleSheet.create({
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  weekDayHeader: {
    width: 45,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: '600',
  },
  dayButton: {
    width: 45,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    position: 'relative',
  },
  dayText: {
    fontSize: 14,
    marginBottom: 2,
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    flexDirection: 'row',
    gap: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  spendingIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  amountText: {
    fontSize: 8,
    fontWeight: '600',
    position: 'absolute',
    bottom: 1,
    left: 2,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 12,
    paddingHorizontal: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 10,
  },
});
