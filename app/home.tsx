import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, RefreshControl } from 'react-native';
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
import { useAppState } from '../contexts/AppStateContext';
import { translateMonth } from '../utils/dateUtils';
import { AdBanner } from '../components/AdBanner';
import { useInterstitialAd } from '../hooks/useInterstitialAd';

export default function HomeScreen() {
  const { t } = useTranslation();
  const { colors, commonStyles } = useStyles();
  const { isFirstLaunch, loading: pinLoading } = usePin();
  const { refreshTrigger } = useAppState();
  const { showAd } = useInterstitialAd();
  const [showMonthSelector, setShowMonthSelector] = useState(false);
  const [pinSetupComplete, setPinSetupComplete] = useState(false);

  const {
    currentMonthBudget,
    selectedMonth,
    selectMonth,
    getAvailableMonths,
    loading,
    refreshData,
  } = useBudget();
  
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  // Auto-refresh quand refreshTrigger change (avec debounce)
  useEffect(() => {
    if (refreshTrigger > 0) {
      console.log('Auto-refreshing home screen due to data change');
      const timer = setTimeout(() => {
        refreshData();
      }, 50); // Debounce de 50ms pour réactivité immédiate
      
      return () => clearTimeout(timer);
    }
  }, [refreshTrigger]);

  const handleDayPress = (date: string) => {
    // Afficher pub avant action importante
    showAd();
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
      <View
        style={[commonStyles.container, { backgroundColor: colors.background }]}
      >
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
    <View
      style={[commonStyles.container, { backgroundColor: colors.background }]}
    >
      <View style={commonStyles.content}>
        <View style={[commonStyles.row, { marginBottom: 20 }]}>
          <Text style={[commonStyles.title, { color: colors.text }]}>
            {t('home')}
          </Text>
          <TouchableOpacity onPress={handleSettingsPress}>
            <Icon name="settings-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        >
          {/* Month Selector */}
          <TouchableOpacity
            style={[commonStyles.card, { backgroundColor: colors.card }]}
            onPress={() => setShowMonthSelector(true)}
          >
            <View style={commonStyles.row}>
              <Text style={[commonStyles.subtitle, { color: colors.text }]}>
                {selectedMonth
                  ? `${translateMonth(selectedMonth.month, t)} ${
                      selectedMonth.year
                    }`
                  : t('selectMonth')}
              </Text>
              <Icon
                name="chevron-down"
                size={20}
                color={colors.textSecondary}
              />
            </View>
          </TouchableOpacity>

          {/* Calendar */}
          {currentMonthBudget && selectedMonth && (
            <Calendar
              key={`calendar-${selectedMonth.month}-${selectedMonth.year}-${currentMonthBudget.days.length}-${currentMonthBudget.updatedAt}-${refreshTrigger}`}
              month={selectedMonth.month}
              year={selectedMonth.year}
              days={currentMonthBudget.days}
              onDayPress={handleDayPress}
            />
          )}

          {/* Quick Stats */}
          {currentMonthBudget && (
            <View style={[commonStyles.card, { backgroundColor: colors.card }]}>
              <Text style={[commonStyles.subtitle, { color: colors.text }]}>
                {t('monthSummary')}
              </Text>

              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: colors.primary }]}>
                    {currentMonthBudget.totalBudget.toLocaleString()}
                  </Text>
                  <Text
                    style={[styles.statLabel, { color: colors.textSecondary }]}
                  >
                    {t('totalBudgetLabel')}
                  </Text>
                </View>

                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: colors.success }]}>
                    {currentMonthBudget.consumedBudget.toLocaleString()}
                  </Text>
                  <Text
                    style={[styles.statLabel, { color: colors.textSecondary }]}
                  >
                    {t('consumedLabel')}
                  </Text>
                </View>

                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: colors.warning }]}>
                    {currentMonthBudget.days.filter(d => d.validated).length}
                  </Text>
                  <Text
                    style={[styles.statLabel, { color: colors.textSecondary }]}
                  >
                    {t('validatedDaysLabel')}
                  </Text>
                </View>

                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: colors.primary }]}>
                    {
                      currentMonthBudget.days.filter(
                        d => d.status === 'planned',
                      ).length
                    }
                  </Text>
                  <Text
                    style={[styles.statLabel, { color: colors.textSecondary }]}
                  >
                    {t('plannedDaysLabel')}
                  </Text>
                </View>
              </View>
            </View>
          )}
          
          {/* Banner AdMob */}
          <View style={{ marginVertical: 10 }}>
            <AdBanner />
          </View>
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
    minWidth: '45%' as any,
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


