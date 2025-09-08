
import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, Modal, RefreshControl } from 'react-native';
import BottomNavigation from '../components/BottomNavigation';
import { useStyles } from '../styles/commonStyles';
import { useBudget } from '../hooks/useBudget';
import BudgetChart from '../components/BudgetChart';
import Icon from '../components/Icon';
import LoadingButton from '../components/LoadingButton';
import Shimmer from '../components/Shimmer';
import { useTranslation } from '../hooks/useTranslation';
import { translateMonth } from '../utils/dateUtils';
import { AdBanner } from '../components/AdBanner';

function BudgetScreen() {
  const { t } = useTranslation();
  const { colors, commonStyles } = useStyles();
  const [showAddContributor, setShowAddContributor] = useState(false);
  const [contributorName, setContributorName] = useState('');
  const [contributorAmount, setContributorAmount] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [selectedContributor, setSelectedContributor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    currentMonthBudget,
    addContributor,
    updateContributor,
    loading: budgetLoading,
    refreshData,
  } = useBudget();
  
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  const handleAddContributor = async () => {
    if (!currentMonthBudget || currentMonthBudget.totalBudget === 0) {
      Alert.alert(
        t('budgetRequired'),
        t('budgetRequiredMessage')
      );
      return;
    }

    if (!contributorName.trim() || !contributorAmount.trim()) {
      Alert.alert(t('error'), t('fillAllFields'));
      return;
    }

    const amount = parseFloat(contributorAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert(t('error'), t('pleaseEnterValidAmount'));
      return;
    }

    setLoading(true);
    try {
      await addContributor(contributorName.trim(), amount);
      setContributorName('');
      setContributorAmount('');
      setShowAddContributor(false);
      Alert.alert(t('success'), t('contributorAdded'));
    } catch (error) {
      console.log('Error adding contributor:', error);
      Alert.alert(t('error'), t('cannotAddContributor'));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateContributorPayment = async (contributorId: string, currentPaid: number) => {
    Alert.prompt(
      t('updatePayment'),
      t('enterNewPaidAmount'),
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: async (value) => {
            if (!value) return;
            
            const amount = parseFloat(value);
            if (isNaN(amount) || amount < 0) {
              Alert.alert(t('error'), t('pleaseEnterValidAmount'));
              return;
            }

            setLoading(true);
            try {
              await updateContributor(contributorId, { paidAmount: amount });
              Alert.alert(t('success'), t('paymentUpdated'));
            } catch (error) {
              console.log('Error updating payment:', error);
              Alert.alert(t('error'), t('cannotUpdatePayment'));
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      'plain-text',
      currentPaid.toString()
    );
  };

  if (budgetLoading) {
    return (
      <View style={[commonStyles.container, { backgroundColor: colors.background }]}>
        <View style={commonStyles.content}>
          <Text style={[commonStyles.title, { color: colors.text }]}>{t('budget')}</Text>
          <View style={[commonStyles.card, { backgroundColor: colors.card }]}>
            <Shimmer height={200} />
          </View>
          <View style={[commonStyles.card, { backgroundColor: colors.card }]}>
            <Shimmer height={150} />
          </View>
        </View>
        <BottomNavigation currentTab="budget" />
      </View>
    );
  }

  return (
    <View style={[commonStyles.container, { backgroundColor: colors.background }]}>
      <View style={commonStyles.content}>
        <Text style={[commonStyles.title, { color: colors.text }]}>{t('monthlyBudget')}</Text>

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
          {/* Budget Overview */}
          <View style={[commonStyles.card, { backgroundColor: colors.card }]}>
            <Text style={[commonStyles.subtitle, { color: colors.text }]}>
              {currentMonthBudget ? `${translateMonth(currentMonthBudget.month, t)} ${currentMonthBudget.year}` : ''}
            </Text>
            
            <Text style={[commonStyles.textSecondary, { marginBottom: 16, color: colors.textSecondary }]}>
              {t('budgetCalculatedFromMeals')}
            </Text>

            {currentMonthBudget && (
              <BudgetChart
                totalBudget={currentMonthBudget.totalBudget}
                consumedBudget={currentMonthBudget.consumedBudget}
                currency={t('currency')}
              />
            )}

            <View style={styles.budgetStats}>
              <View style={styles.statItem}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('totalBudgetLabel')}</Text>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {currentMonthBudget?.totalBudget.toLocaleString() || '0'} {t('currency')}
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('consumedLabel')}</Text>
                <Text style={[styles.statValue, { color: colors.success }]}>
                  {currentMonthBudget?.consumedBudget.toLocaleString() || '0'} {t('currency')}
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('remainingLabel')}</Text>
                <Text style={[styles.statValue, { color: colors.primary }]}>
                  {currentMonthBudget?.remainingBudget.toLocaleString() || '0'} {t('currency')}
                </Text>
              </View>
            </View>
          </View>

          {/* Contributors */}
          <View style={[commonStyles.card, { backgroundColor: colors.card }]}>
            <View style={commonStyles.row}>
              <Text style={[commonStyles.subtitle, { color: colors.text }]}>{t('contributors')}</Text>
              <TouchableOpacity
                onPress={() => setShowAddContributor(true)}
                disabled={!currentMonthBudget || currentMonthBudget.totalBudget === 0}
                style={{ opacity: (!currentMonthBudget || currentMonthBudget.totalBudget === 0) ? 0.5 : 1 }}
              >
                <Icon name="add-circle" size={24} color={colors.primary} />
              </TouchableOpacity>
            </View>

            {(!currentMonthBudget || currentMonthBudget.totalBudget === 0) && (
              <Text style={[commonStyles.textSecondary, { marginTop: 8, fontStyle: 'italic', color: colors.textSecondary }]}>
                {t('planFirstBudget')}
              </Text>
            )}

            {currentMonthBudget?.contributors.map((contributor) => (
              <View key={contributor.id} style={[styles.contributorItem, { borderBottomColor: colors.border }]}>
                <View style={styles.contributorInfo}>
                  <Text style={[styles.contributorName, { color: colors.text }]}>{contributor.name}</Text>
                  <Text style={[styles.contributorAmount, { color: colors.textSecondary }]}>
                    {t('contribution')}: {contributor.totalContribution.toLocaleString()} {t('currency')}
                  </Text>
                </View>
                
                <View style={styles.contributorActions}>
                  <View style={styles.paymentInfo}>
                    <Text style={[styles.paidAmount, { color: colors.primary }]}>
                      {t('paid')}: {contributor.paidAmount.toLocaleString()} {t('currency')}
                    </Text>
                  </View>
                  
                  <TouchableOpacity
                    onPress={() => handleUpdateContributorPayment(contributor.id, contributor.paidAmount)}
                    style={[styles.updateButton, { backgroundColor: colors.primary }]}
                  >
                    <Icon name="card" size={16} color={colors.backgroundAlt} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {currentMonthBudget?.contributors.length === 0 && currentMonthBudget.totalBudget > 0 && (
              <Text style={[commonStyles.textSecondary, { textAlign: 'center', marginTop: 16, color: colors.textSecondary }]}>
                {t('noContributorsAdded')}
              </Text>
            )}
          </View>
          
          {/* Banner publicitaire */}
          <View style={{ marginVertical: 10 }}>
            <AdBanner />
          </View>
        </ScrollView>
      </View>

      {/* Add Contributor Modal */}
      <Modal
        visible={showAddContributor}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddContributor(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>{t('addContributor')}</Text>
            
            <TextInput
              style={[commonStyles.input, { backgroundColor: colors.backgroundAlt, borderColor: colors.border, color: colors.text }]}
              placeholder={t('contributorName')}
              placeholderTextColor={colors.textSecondary}
              value={contributorName}
              onChangeText={setContributorName}
            />
            
            <TextInput
              style={[commonStyles.input, { marginTop: 12, backgroundColor: colors.backgroundAlt, borderColor: colors.border, color: colors.text }]}
              placeholder={`${t('paid')} (${t('currency')})`}
              placeholderTextColor={colors.textSecondary}
              value={contributorAmount}
              onChangeText={setContributorAmount}
              keyboardType="numeric"
            />
            
            <View style={styles.modalActions}>
              <LoadingButton
                title={t('cancel')}
                onPress={() => setShowAddContributor(false)}
                variant="secondary"
                style={{ flex: 1 }}
              />
              <LoadingButton
                title={t('add')}
                onPress={handleAddContributor}
                style={{ flex: 1 }}
                icon="person-add"
              />
            </View>
          </View>
        </View>
      </Modal>

      <BottomNavigation currentTab="budget" />
    </View>
  );
}

const styles = {
  budgetStats: {
    marginTop: 20,
  },
  statItem: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  contributorItem: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  contributorInfo: {
    flex: 1,
  },
  contributorName: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  contributorAmount: {
    fontSize: 12,
  },
  contributorActions: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 12,
  },
  paymentInfo: {
    alignItems: 'flex-end' as const,
  },
  paidAmount: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  updateButton: {
    padding: 8,
    borderRadius: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: 20,
  },
  modalContent: {
    width: '100%' as any,
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    marginBottom: 20,
    textAlign: 'center' as const,
  },
  modalActions: {
    flexDirection: 'row' as const,
    gap: 12,
    marginTop: 20,
  },
};

export default BudgetScreen;
