import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { router } from 'expo-router';
import BottomNavigation from '../components/BottomNavigation';
import PinSetupScreen from '../components/PinSetupScreen';
import { useStyles } from '../styles/commonStyles';
import { useBudget } from '../hooks/useBudget';
import { usePin } from '../hooks/usePin';
import Calendar from '../components/Calendar';
import Icon from '../components/Icon';
import MonthSelector from '../components/MonthSelector';
import Shimmer from '../components/Shimmer';
import { useTranslation } from '../hooks/useTranslation';

export default function HomeScreen() {
  const { t } = useTranslation();
  const { colors, commonStyles } = useStyles();
  const { isFirstLaunch, loading: pinLoading } = usePin();
  const [showMonthSelector, setShowMonthSelector] = useState(false);
  const [pinSetupComplete, setPinSetupComplete] = useState(false);

  const {
    currentMonthBudget,
    selectedMonth,
    selectMonth,
    getAvailableMonths,
    loading,
  } = useBudget();

  const handleDayPress = (date: string) => {
    router.push(`/day-details?date=${date}`);
  };

  const handleSettingsPress = () => {
    router.push('/settings');
  };

  const handleQuickExport = () => {
    router.push('/settings');
    // Could add direct export here if needed
  };

  const handleMonthSelect = (month: any) => {
    selectMonth(month.month, month.year);
    setShowMonthSelector(false);
  };

  // Show PIN setup screen on first launch only
  if (isFirstLaunch && !pinSetupComplete && !pinLoading) {
    return <PinSetupScreen onComplete={() => setPinSetupComplete(true)} />;
  }

  if (loading || pinLoading) {
    return (
      <View style={[commonStyles.container, { backgroundColor: colors.background }]}>
        <View style={commonStyles.content}>
          <View style={[commonStyles.row, { marginBottom: 20 }]}>
            <Shimmer width={200} height={32} />
            <Shimmer width={24} height={24} borderRadius={12} />
          </View>
          <View style={[commonStyles.card, { backgroundColor: colors.card }]}>
            <Shimmer height={300} />
          </View>
        </View>
        <BottomNavigation currentTab="home" />
      </View>
    );
  }

  return (
    <View style={[commonStyles.container, { backgroundColor: colors.background }]}>
      <View style={commonStyles.content}>
        <View style={[commonStyles.row, { marginBottom: 20 }]}>
          <Text style={[commonStyles.title, { color: colors.text }]}>{t('home')}</Text>
          <TouchableOpacity onPress={handleSettingsPress}>
            <Icon name="settings-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Month Selector */}
          <TouchableOpacity
            style={[commonStyles.card, { backgroundColor: colors.card }]}
            onPress={() => setShowMonthSelector(true)}
          >
            <View style={commonStyles.row}>
              <Text style={[commonStyles.subtitle, { color: colors.text }]}>
                {selectedMonth?.displayName || 'Sélectionner le mois'}
              </Text>
              <Icon name="chevron-down" size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>

          {/* Calendar */}
          {currentMonthBudget && selectedMonth && (
            <Calendar
              month={selectedMonth.month}
              year={selectedMonth.year}
              days={currentMonthBudget.days}
              onDayPress={handleDayPress}
            />
          )}

          {/* Quick Stats */}
          {currentMonthBudget && (
            <View style={[commonStyles.card, { backgroundColor: colors.card }]}>
              <Text style={[commonStyles.subtitle, { color: colors.text }]}>Résumé du mois</Text>
              
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: colors.primary }]}>
                    {currentMonthBudget.totalBudget.toLocaleString()}
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Budget total</Text>
                </View>
                
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: colors.success }]}>
                    {currentMonthBudget.consumedBudget.toLocaleString()}
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Consommé</Text>
                </View>
                
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: colors.warning }]}>
                    {currentMonthBudget.days.filter(d => d.validated).length}
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Jours validés</Text>
                </View>
                
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: colors.primary }]}>
                    {currentMonthBudget.days.filter(d => d.status === 'planned').length}
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Jours planifiés</Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Month Selector Modal */}
      <Modal
        visible={showMonthSelector}
        transparent
        animationType="slide"
        onRequestClose={() => setShowMonthSelector(false)}
      >
        <MonthSelector
          availableMonths={getAvailableMonths()}
          selectedMonth={selectedMonth}
          onMonthSelect={handleMonthSelect}
          onClose={() => setShowMonthSelector(false)}
        />
      </Modal>

      <BottomNavigation currentTab="home" />
    </View>
  );
}

const styles = {
  statsGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    marginTop: 16,
    gap: 16,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center' as const,
    padding: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center' as const,
  },
};