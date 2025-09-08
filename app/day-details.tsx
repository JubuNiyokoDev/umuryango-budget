
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStyles } from '../styles/commonStyles';
import { useTranslation } from '../hooks/useTranslation';
import { useBudget } from '../hooks/useBudget';
import { useAppState } from '../contexts/AppStateContext';
import { DayBudget, Meal } from '../types/budget';
import MealSection from '../components/MealSection';
import PlanningActions from '../components/PlanningActions';
import LoadingButton from '../components/LoadingButton';
import Icon from '../components/Icon';
import { AdBanner } from '../components/AdBanner';
import { useInterstitialAd } from '../hooks/useInterstitialAd';

export default function DayDetailsScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const { t } = useTranslation();
  const { colors, commonStyles } = useStyles();
  const { budgetUpdated } = useAppState();
  const { showAd } = useInterstitialAd();
  const { 
    getDayBudget, 
    addMealItem, 
    removeMealItem, 
    validateDay, 
    canEditDay,
    currentMonthBudget,
    replaceMealItems,
    getMonthDates,
    getEditableDates,
    duplicateFullDay,
    forceRefreshCurrentMonth,
    selectedMonth,
    selectMonth,
    refreshData
  } = useBudget();
  
  const [dayBudget, setDayBudget] = useState<DayBudget | null>(null);
  const [isEditable, setIsEditable] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoadingDay, setIsLoadingDay] = useState(true);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    await loadDayBudget();
    setRefreshing(false);
  };

  useEffect(() => {
    if (date) {
      loadDayBudget();
    }
  }, [date]); // Only reload when date changes

  // Force reload when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (date) {
        console.log('Screen focused, reloading day budget for:', date);
        loadDayBudget();
      }
    }, [date])
  );

  const loadDayBudget = async () => {
    if (!date) return;
    
    setIsLoadingDay(true);
    
    // Vérifier si on doit changer de mois
    const dateObj = new Date(date);
    const month = dateObj.getMonth();
    const year = dateObj.getFullYear();
    
    // Forcer le changement de mois si nécessaire
    if (!selectedMonth || selectedMonth.month !== month || selectedMonth.year !== year) {
      console.log(`Forcing month switch to ${month}/${year} for date ${date}`);
      
      // Charger directement le mois sans passer par selectedMonth
      const monthId = `${year}-${month + 1}`;
      try {
        const data = await AsyncStorage.getItem(`@budget_data_${monthId}`);
        if (data) {
          const parsedData = JSON.parse(data);
          console.log(`Direct load of month ${monthId}:`, parsedData.days.length, 'days');
          
          // Mettre à jour directement currentMonthBudget
          const budget = getDayBudget(date);
          if (parsedData.days.find((d: any) => d.date === date)) {
            console.log('Found day in direct loaded month');
            setDayBudget(parsedData.days.find((d: any) => d.date === date));
            setIsEditable(canEditDay(date));
            setIsLoadingDay(false);
            return;
          }
        }
      } catch (error) {
        console.error('Error direct loading month:', error);
      }
      
      // Si échec du chargement direct, utiliser la méthode normale
      selectMonth(month, year);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Attendre que currentMonthBudget soit disponible pour le bon mois
    let retries = 0;
    while (retries < 10) {
      if (currentMonthBudget && currentMonthBudget.monthNumber === month && currentMonthBudget.year === year) {
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 200));
      retries++;
    }
    
    // Charger les données du jour
    const budget = getDayBudget(date);
    setDayBudget(budget);
    setIsEditable(canEditDay(date));
    console.log('Loaded day budget:', budget);
    console.log('Is editable:', canEditDay(date));
    setIsLoadingDay(false);
  };

  const handleAddItem = async (mealType: 'morning' | 'noon' | 'evening', item: { name: string; price: number }) => {
    if (!date || !isEditable) {
      Alert.alert(t('error'), t('cannotEditValidatedDay'));
      return;
    }

    console.log('Adding item:', { mealType, item });
    await addMealItem(date, mealType, item);
    loadDayBudget(); // Refresh the data
    
    // Immediate refresh
    budgetUpdated(); // Trigger global refresh
  };

  const handleRemoveItem = async (mealType: 'morning' | 'noon' | 'evening', itemId: string) => {
    if (!date || !isEditable) {
      Alert.alert(t('error'), t('cannotEditValidatedDay'));
      return;
    }

    console.log('Removing item:', { mealType, itemId });
    await removeMealItem(date, mealType, itemId);
    loadDayBudget(); // Refresh the data
    
    // Immediate refresh
    budgetUpdated(); // Trigger global refresh
  };

  const handlePasteMeal = async (mealType: 'morning' | 'noon' | 'evening', mealToPaste: Meal) => {
    if (!date || !isEditable) {
      Alert.alert(t('error'), t('cannotEditValidatedDay'));
      return;
    }

    // Remplacer tous les items du repas
    await replaceMealItems(date, mealType, mealToPaste.items);
    loadDayBudget();
    Alert.alert(t('success'), t('mealCopied'));
    
    // Immediate refresh
    budgetUpdated(); // Trigger global refresh
  };

  const handleDuplicateToDate = async (targetDate: string, meals: Meal[]) => {
    console.log('Duplicating to date:', targetDate, 'meals:', meals);
    await duplicateFullDay(targetDate, meals);
    await forceRefreshCurrentMonth();
    loadDayBudget(); // Refresh current day if needed
    
    // Immediate refresh
    budgetUpdated(); // Trigger global refresh
  };

  const handleBulkPlan = async (dates: string[], meals: Meal[]) => {
    console.log('Bulk planning for dates:', dates, 'meals:', meals);
    
    for (const targetDate of dates) {
      await duplicateFullDay(targetDate, meals);
    }
    
    await forceRefreshCurrentMonth();
    loadDayBudget(); // Refresh current day if needed
    
    // Immediate refresh
    budgetUpdated(); // Trigger global refresh
  };

  const handleValidateDay = async () => {
    if (!date || !dayBudget) return;

    if (dayBudget.validated) {
      Alert.alert(t('information'), t('dayAlreadyValidated'));
      return;
    }
    
    showAd(); // Pub avant validation

    if (dayBudget.total === 0) {
      Alert.alert(t('warning'), t('noMealsPlannedValidateAnyway'), [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('confirm'),
          onPress: async () => {
            await validateDay(date);
            budgetUpdated(); // Trigger global refresh
            Alert.alert(t('success'), t('dayValidatedSuccessfully'));
            setTimeout(() => {
              loadDayBudget();
            }, 500);
          },
        },
      ]);
      return;
    }

    Alert.alert(
      t('confirm'),
      t('validateDayConfirmation').replace('{amount}', dayBudget.total.toLocaleString()).replace('{currency}', t('currency')),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('validateDay'),
          onPress: async () => {
            console.log('Validating day:', date);
            await validateDay(date);
            budgetUpdated(); // Trigger global refresh
            Alert.alert(t('success'), t('dayValidatedSuccessfully'));
            setTimeout(() => {
              loadDayBudget();
            }, 500);
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getMealByType = (type: 'morning' | 'noon' | 'evening'): Meal => {
    // Always try to get fresh data first
    const freshDayBudget = date ? getDayBudget(date) : null;
    const budgetToUse = freshDayBudget || dayBudget;
    
    if (!budgetToUse) {
      return {
        id: `${Date.now()}-${type}`,
        type,
        items: [],
        total: 0,
      };
    }

    const meal = budgetToUse.meals.find(m => m.type === type);
    return meal || {
      id: `${Date.now()}-${type}`,
      type,
      items: [],
      total: 0,
    };
  };

  const getStatusInfo = () => {
    if (!dayBudget) return { text: t('notPlanned'), color: colors.textSecondary };
    
    if (dayBudget.validated) {
      return { text: t('validated'), color: colors.success };
    }
    
    if (dayBudget.total > 0) {
      return { text: t('planned'), color: colors.primary };
    }
    
    return { text: t('pending'), color: colors.warning };
  };

  const isToday = () => {
    if (!date) return false;
    const today = new Date();
    const dayDate = new Date(date);
    return today.toDateString() === dayDate.toDateString();
  };

  const isPast = () => {
    if (!date) return false;
    const today = new Date();
    const dayDate = new Date(date);
    today.setHours(0, 0, 0, 0);
    dayDate.setHours(0, 0, 0, 0);
    return dayDate < today;
  };

  const statusInfo = getStatusInfo();

  if (!date) {
    return (
      <View style={[commonStyles.container, commonStyles.center]}>
        <Text style={[commonStyles.text, { color: colors.text }]}>{t('dateNotSpecified')}</Text>
      </View>
    );
  }

  return (
    <View style={[commonStyles.container, { backgroundColor: colors.background }]}>
      <View style={commonStyles.content}>
        {/* Header */}
        <View style={[commonStyles.row, { marginBottom: 20 }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[commonStyles.title, { flex: 1, textAlign: 'center', color: colors.text }]}>
            {t('dayDetails')}
          </Text>
          <View style={{ width: 24 }} />
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
          {/* Date and Status */}
          <View style={[commonStyles.card, { backgroundColor: colors.card }]}>
            <Text style={[commonStyles.subtitle, { color: colors.text }]}>
              {formatDate(date)}
            </Text>
            <View style={[commonStyles.row, { marginTop: 8 }]}>
              <Text style={[commonStyles.text, { color: colors.text }]}>{t('status')}:</Text>
              <View style={styles.statusBadge}>
                <View style={[styles.statusDot, { backgroundColor: statusInfo.color }]} />
                <Text style={[commonStyles.text, { color: statusInfo.color, fontWeight: '600' }]}>
                  {statusInfo.text}
                </Text>
              </View>
            </View>
            
            {dayBudget?.validatedAt && (
              <Text style={[commonStyles.textSecondary, { marginTop: 4, color: colors.textSecondary }]}>
                {t('validatedOn')} {new Date(dayBudget.validatedAt).toLocaleDateString('fr-FR')}
              </Text>
            )}

            {!isEditable && (
              <View style={[styles.warningBanner, { backgroundColor: isPast() ? colors.primary + '20' : colors.warning + '20' }]}>
                <Icon name={isPast() ? "eye" : "lock-closed"} size={16} color={isPast() ? colors.primary : colors.warning} />
                <Text style={[commonStyles.textSecondary, { color: isPast() ? colors.primary : colors.warning, marginLeft: 8 }]}>
                  {isPast() ? t('readOnlyModePastDay') : t('dayCannotBeEdited')}
                </Text>
              </View>
            )}
          </View>

          {/* Empty past day message - seulement si vraiment aucune donnée ET pas en cours de chargement */}
          {!isLoadingDay && isPast() && (!dayBudget || (dayBudget.total === 0 && !dayBudget.meals.some(meal => meal.items.length > 0))) && (
            <View style={[commonStyles.card, { backgroundColor: colors.card }]}>
              <View style={[commonStyles.center, { padding: 20 }]}>
                <Icon name="calendar-outline" size={48} color={colors.textSecondary} />
                <Text style={[commonStyles.text, { marginTop: 16, textAlign: 'center', color: colors.textSecondary }]}>
                  {t('noPlanningForThisDay')}
                </Text>
                <Text style={[commonStyles.textSecondary, { marginTop: 8, textAlign: 'center', color: colors.textSecondary }]}>
                  {t('pastDayNoMealsPlanned')}
                </Text>
              </View>
            </View>
          )}

          {/* Meals - show if day has data OR is editable OR still loading */}
          {(isLoadingDay || (dayBudget && (dayBudget.total > 0 || dayBudget.meals.some(meal => meal.items.length > 0))) || isEditable) && (
            <>
              <MealSection
                meal={getMealByType('morning')}
                title={t('morning')}
                icon="sunny"
                onAddItem={(item) => handleAddItem('morning', item)}
                onRemoveItem={(itemId) => handleRemoveItem('morning', itemId)}
                onPasteMeal={(meal) => handlePasteMeal('morning', meal)}
                currency={t('currency')}
                disabled={!isEditable}
                currentDate={date}
              />

              <MealSection
                meal={getMealByType('noon')}
                title={t('noon')}
                icon="sunny-outline"
                onAddItem={(item) => handleAddItem('noon', item)}
                onRemoveItem={(itemId) => handleRemoveItem('noon', itemId)}
                onPasteMeal={(meal) => handlePasteMeal('noon', meal)}
                currency={t('currency')}
                disabled={!isEditable}
                currentDate={date}
              />

              <MealSection
                meal={getMealByType('evening')}
                title={t('evening')}
                icon="moon"
                onAddItem={(item) => handleAddItem('evening', item)}
                onRemoveItem={(itemId) => handleRemoveItem('evening', itemId)}
                onPasteMeal={(meal) => handlePasteMeal('evening', meal)}
                currency={t('currency')}
                disabled={!isEditable}
                currentDate={date}
              />

              {/* Actions de planification */}
              <PlanningActions
                currentDate={date}
                dayMeals={dayBudget?.meals || []}
                onDuplicateToDate={handleDuplicateToDate}
                onBulkPlan={handleBulkPlan}
                availableDates={getEditableDates()}
                disabled={!isEditable}
              />
            </>
          )}

          {/* Total and Actions - show if day has data OR is editable */}
          {((dayBudget && (dayBudget.total > 0 || dayBudget.meals.some(meal => meal.items.length > 0))) || isEditable) && (
            <View style={[commonStyles.card, { backgroundColor: colors.card }]}>
              <View style={commonStyles.row}>
                <Text style={[commonStyles.subtitle, { color: colors.primary }]}>
                  {t('total')}:
                </Text>
                <Text style={[commonStyles.title, { color: colors.primary }]}>
                  {dayBudget?.total.toLocaleString() || '0'} {t('currency')}
                </Text>
              </View>

            {/* Spending Level Indicator */}
            {dayBudget?.spendingLevel && (
              <View style={[commonStyles.row, { marginTop: 8 }]}>
                <Text style={[commonStyles.textSecondary, { color: colors.textSecondary }]}>{t('spendingLevel')}:</Text>
                <Text style={[
                  commonStyles.text,
                  {
                    fontWeight: '600',
                    color: dayBudget.spendingLevel === 'high' ? colors.error :
                          dayBudget.spendingLevel === 'medium' ? colors.warning :
                          colors.success
                  }
                ]}>
                  {dayBudget.spendingLevel === 'high' ? t('highSpending') :
                   dayBudget.spendingLevel === 'medium' ? t('mediumSpending') :
                   t('lowSpending')}
                </Text>
              </View>
            )}

            {/* Validation Button - only show for today and if day has planned items */}
            {isToday() && !dayBudget?.validated && dayBudget && dayBudget.total > 0 && (
              <LoadingButton
                title={t('validateDay')}
                onPress={handleValidateDay}
                style={{ marginTop: 16 }}
                icon="checkmark-circle"
              />
            )}

            {dayBudget?.validated && (
              <View style={[styles.validatedBanner, { marginTop: 16, backgroundColor: colors.success + '20' }]}>
                <Icon name="checkmark-circle" size={20} color={colors.success} />
                <Text style={[commonStyles.text, { color: colors.success, marginLeft: 8, fontWeight: '600' }]}>
                  {t('dayValidated')}
                </Text>
              </View>
            )}
            </View>
          )}
          
          {/* Banner publicitaire */}
          <View style={{ marginVertical: 10 }}>
            <AdBanner />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = {
  statusBadge: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  warningBanner: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
  },
  validatedBanner: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    padding: 12,
    borderRadius: 8,
  },
};
