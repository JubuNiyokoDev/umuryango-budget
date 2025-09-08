
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, RefreshControl } from 'react-native';
import BottomNavigation from '../components/BottomNavigation';
import { useBudget } from '../hooks/useBudget';
import { useStyles } from '../styles/commonStyles';
import { MonthlyBudget } from '../types/budget';
import { router } from 'expo-router';
import Icon from '../components/Icon';
import Shimmer from '../components/Shimmer';
import { useTranslation } from '../hooks/useTranslation';
import { translateMonth } from '../utils/dateUtils';
import { AdBanner } from '../components/AdBanner';

function HistoryScreen() {
  const { t } = useTranslation();
  const { colors, commonStyles } = useStyles();
  const [selectedMonth, setSelectedMonth] = useState<MonthlyBudget | null>(null);
  const [showMonthDetails, setShowMonthDetails] = useState(false);

  const { budgetHistory, loading, refreshData } = useBudget();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'validated':
        return colors.success;
      case 'planned':
        return colors.primary;
      default:
        return colors.warning;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'validated':
        return t('validated');
      case 'planned':
        return t('planned');
      default:
        return t('pending');
    }
  };

  const handleMonthPress = (month: MonthlyBudget) => {
    setSelectedMonth(month);
    setShowMonthDetails(true);
  };

  const calculateMonthStats = (month: MonthlyBudget) => {
    const validatedDays = month.days.filter(d => d.validated).length;
    const plannedDays = month.days.filter(d => d.status === 'planned').length;
    const averagePerDay = month.days.length > 0 ? month.totalBudget / month.days.length : 0;
    
    return {
      validatedDays,
      plannedDays,
      averagePerDay,
      totalDays: month.days.length,
    };
  };

  if (loading) {
    return (
      <View style={[commonStyles.container, { backgroundColor: colors.background }]}>
        <View style={commonStyles.content}>
          <Text style={[commonStyles.title, { color: colors.text }]}>{t('history')}</Text>
          {[1, 2, 3].map(i => (
            <View key={i} style={[commonStyles.card, { backgroundColor: colors.card }]}>
              <Shimmer height={120} />
            </View>
          ))}
        </View>
        <BottomNavigation currentTab="history" />
      </View>
    );
  }

  return (
    <View style={[commonStyles.container, { backgroundColor: colors.background }]}>
      <View style={commonStyles.content}>
        <Text style={[commonStyles.title, { color: colors.text }]}>{t('historyTitle')}</Text>

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
          {budgetHistory.monthlyBudgets.length === 0 ? (
            <View style={[commonStyles.card, commonStyles.center, { backgroundColor: colors.card, minHeight: 200 }]}>
              <Icon name="time-outline" size={48} color={colors.textSecondary} />
              <Text style={[commonStyles.text, { marginTop: 16, textAlign: 'center', color: colors.textSecondary }]}>
                {t('noHistory')}
              </Text>
            </View>
          ) : (
            budgetHistory.monthlyBudgets
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((month) => {
                const stats = calculateMonthStats(month);
                
                return (
                  <TouchableOpacity
                    key={month.id}
                    style={[commonStyles.card, { backgroundColor: colors.card }]}
                    onPress={() => handleMonthPress(month)}
                  >
                    <View style={commonStyles.row}>
                      <Text style={[commonStyles.subtitle, { color: colors.text }]}>
                        {translateMonth(month.month, t)} {month.year}
                      </Text>
                      <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
                    </View>

                    <View style={styles.monthStats}>
                      <View style={styles.statRow}>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('totalBudgetLabel')}:</Text>
                        <Text style={[styles.statValue, { color: colors.primary }]}>
                          {month.totalBudget.toLocaleString()} {t('currency')}
                        </Text>
                      </View>
                      
                      <View style={styles.statRow}>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('consumedLabel')}:</Text>
                        <Text style={[styles.statValue, { color: colors.success }]}>
                          {month.consumedBudget.toLocaleString()} {t('currency')}
                        </Text>
                      </View>
                      
                      <View style={styles.statRow}>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('validatedDaysLabel')}:</Text>
                        <Text style={[styles.statValue, { color: colors.text }]}>
                          {stats.validatedDays}/{stats.totalDays}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${Math.min((month.consumedBudget / month.totalBudget) * 100, 100)}%`,
                            backgroundColor: colors.success,
                          },
                        ]}
                      />
                    </View>
                  </TouchableOpacity>
                );
              })
          )}
          
          {/* Banner publicitaire */}
          <View style={{ marginVertical: 10 }}>
            <AdBanner />
          </View>
        </ScrollView>
      </View>

      {/* Month Details Modal */}
      <Modal
        visible={showMonthDetails}
        transparent
        animationType="slide"
        onRequestClose={() => setShowMonthDetails(false)}
      >
        {selectedMonth && (
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
              <View style={[commonStyles.row, { marginBottom: 20 }]}>
                <Text style={[commonStyles.title, { color: colors.text }]}>
                  {translateMonth(selectedMonth.month, t)} {selectedMonth.year}
                </Text>
                <TouchableOpacity onPress={() => setShowMonthDetails(false)}>
                  <Icon name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Month Statistics */}
                <View style={[styles.statsSection, { borderBottomColor: colors.border }]}>
                  <Text style={[commonStyles.subtitle, { color: colors.text }]}>{t('statistics')}</Text>
                  
                  <View style={styles.detailStats}>
                    <View style={styles.detailStatItem}>
                      <Text style={[styles.detailStatValue, { color: colors.primary }]}>
                        {selectedMonth.totalBudget.toLocaleString()}
                      </Text>
                      <Text style={[styles.detailStatLabel, { color: colors.textSecondary }]}>
                        {t('totalPlanned')} ({t('currency')})
                      </Text>
                    </View>
                    
                    <View style={styles.detailStatItem}>
                      <Text style={[styles.detailStatValue, { color: colors.success }]}>
                        {selectedMonth.consumedBudget.toLocaleString()}
                      </Text>
                      <Text style={[styles.detailStatLabel, { color: colors.textSecondary }]}>
                        {t('totalConsumed')} ({t('currency')})
                      </Text>
                    </View>
                    
                    <View style={styles.detailStatItem}>
                      <Text style={[styles.detailStatValue, { color: colors.warning }]}>
                        {selectedMonth.remainingBudget.toLocaleString()}
                      </Text>
                      <Text style={[styles.detailStatLabel, { color: colors.textSecondary }]}>
                        {t('remainingAmount')} ({t('currency')})
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Days List */}
                <View style={styles.daysSection}>
                  <Text style={[commonStyles.subtitle, { color: colors.text }]}>{t('daysOfMonth')}</Text>
                  
                  {selectedMonth.days
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map((day) => (
                      <TouchableOpacity
                        key={day.id}
                        style={[styles.dayItem, { borderBottomColor: colors.border }]}
                        onPress={() => {
                          setShowMonthDetails(false);
                          router.push(`/day-details?date=${day.date}`);
                        }}
                      >
                        <View>
                          <Text style={[styles.dayDate, { color: colors.text }]}>
                            {formatDate(day.date)}
                          </Text>
                          <Text style={[styles.dayAmount, { color: colors.textSecondary }]}>
                            {day.total.toLocaleString()} {t('currency')}
                          </Text>
                        </View>
                        
                        <View style={styles.dayStatus}>
                          <View style={[
                            styles.statusDot,
                            { backgroundColor: getStatusColor(day.status) }
                          ]} />
                          <Text style={[
                            styles.statusText,
                            { color: getStatusColor(day.status) }
                          ]}>
                            {getStatusText(day.status)}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                </View>
              </ScrollView>
            </View>
          </View>
        )}
      </Modal>

      <BottomNavigation currentTab="history" />
    </View>
  );
}

const styles = {
  monthStats: {
    marginTop: 12,
    gap: 8,
  },
  statRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  statLabel: {
    fontSize: 14,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginTop: 12,
    overflow: 'hidden' as const,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end' as const,
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '80%',
  },
  statsSection: {
    paddingBottom: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
  },
  detailStats: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 16,
    marginTop: 16,
  },
  detailStatItem: {
    flex: 1,
    minWidth: '30%',
    alignItems: 'center' as const,
  },
  detailStatValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  detailStatLabel: {
    fontSize: 10,
    textAlign: 'center' as const,
  },
  daysSection: {
    flex: 1,
  },
  dayItem: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  dayDate: {
    fontSize: 14,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  dayAmount: {
    fontSize: 12,
  },
  dayStatus: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
};

export default HistoryScreen;
