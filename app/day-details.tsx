
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { useStyles } from '../styles/commonStyles';
import { useTranslation } from '../hooks/useTranslation';
import { useBudget } from '../hooks/useBudget';
import { DayBudget, Meal } from '../types/budget';
import MealSection from '../components/MealSection';
import LoadingButton from '../components/LoadingButton';
import Icon from '../components/Icon';

export default function DayDetailsScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const { t } = useTranslation();
  const { colors, commonStyles } = useStyles();
  const { 
    getDayBudget, 
    addMealItem, 
    removeMealItem, 
    validateDay, 
    canEditDay,
    currentMonthBudget
  } = useBudget();
  
  const [dayBudget, setDayBudget] = useState<DayBudget | null>(null);
  const [isEditable, setIsEditable] = useState(true);

  useEffect(() => {
    if (date) {
      loadDayBudget();
    }
  }, [date, currentMonthBudget]); // Reload when currentMonthBudget changes

  // Force reload when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (date) {
        console.log('Screen focused, reloading day budget for:', date);
        loadDayBudget();
      }
    }, [date])
  );

  const loadDayBudget = () => {
    if (!date) return;
    
    const budget = getDayBudget(date);
    setDayBudget(budget);
    setIsEditable(canEditDay(date));
    console.log('Loaded day budget:', budget);
    console.log('Is editable:', canEditDay(date));
    
    // If no budget found but we should have data, force refresh
    if (!budget) {
      console.log('No budget found, checking if data exists...');
      // Small delay to ensure data is loaded
      setTimeout(() => {
        const retryBudget = getDayBudget(date);
        if (retryBudget) {
          console.log('Found budget on retry:', retryBudget);
          setDayBudget(retryBudget);
        }
      }, 100);
    }
  };

  const handleAddItem = async (mealType: 'morning' | 'noon' | 'evening', item: { name: string; price: number }) => {
    if (!date || !isEditable) {
      Alert.alert(t('error'), t('cannotEditValidatedDay'));
      return;
    }

    console.log('Adding item:', { mealType, item });
    await addMealItem(date, mealType, item);
    loadDayBudget(); // Refresh the data
  };

  const handleRemoveItem = async (mealType: 'morning' | 'noon' | 'evening', itemId: string) => {
    if (!date || !isEditable) {
      Alert.alert(t('error'), t('cannotEditValidatedDay'));
      return;
    }

    console.log('Removing item:', { mealType, itemId });
    await removeMealItem(date, mealType, itemId);
    loadDayBudget(); // Refresh the data
  };

  const handleValidateDay = async () => {
    if (!date || !dayBudget) return;

    if (dayBudget.validated) {
      Alert.alert('Information', 'Ce jour est déjà validé');
      return;
    }

    if (dayBudget.total === 0) {
      Alert.alert('Attention', 'Aucun repas planifié pour ce jour. Voulez-vous quand même valider?', [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('confirm'),
          onPress: async () => {
            await validateDay(date);
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
      `Valider ce jour avec un total de ${dayBudget.total.toLocaleString()} ${t('currency')}?\n\nUne fois validé, ce jour ne pourra plus être modifié.`,
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('validateDay'),
          onPress: async () => {
            console.log('Validating day:', date);
            await validateDay(date);
            Alert.alert(t('success'), t('dayValidatedSuccessfully'));
            // Wait a bit for the data to be saved, then reload
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
    if (!dayBudget) return { text: 'Non planifié', color: colors.textSecondary };
    
    if (dayBudget.validated) {
      return { text: 'Validé', color: colors.success };
    }
    
    if (dayBudget.total > 0) {
      return { text: 'Planifié', color: colors.primary };
    }
    
    return { text: 'En attente', color: colors.warning };
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
        <Text style={[commonStyles.text, { color: colors.text }]}>Date non spécifiée</Text>
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

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Date and Status */}
          <View style={[commonStyles.card, { backgroundColor: colors.card }]}>
            <Text style={[commonStyles.subtitle, { color: colors.text }]}>
              {formatDate(date)}
            </Text>
            <View style={[commonStyles.row, { marginTop: 8 }]}>
              <Text style={[commonStyles.text, { color: colors.text }]}>Statut:</Text>
              <View style={styles.statusBadge}>
                <View style={[styles.statusDot, { backgroundColor: statusInfo.color }]} />
                <Text style={[commonStyles.text, { color: statusInfo.color, fontWeight: '600' }]}>
                  {statusInfo.text}
                </Text>
              </View>
            </View>
            
            {dayBudget?.validatedAt && (
              <Text style={[commonStyles.textSecondary, { marginTop: 4, color: colors.textSecondary }]}>
                Validé le {new Date(dayBudget.validatedAt).toLocaleDateString('fr-FR')}
              </Text>
            )}

            {!isEditable && (
              <View style={[styles.warningBanner, { backgroundColor: isPast() ? colors.primary + '20' : colors.warning + '20' }]}>
                <Icon name={isPast() ? "eye" : "lock-closed"} size={16} color={isPast() ? colors.primary : colors.warning} />
                <Text style={[commonStyles.textSecondary, { color: isPast() ? colors.primary : colors.warning, marginLeft: 8 }]}>
                  {isPast() ? 'Mode lecture seule - Jour passé' : t('dayCannotBeEdited')}
                </Text>
              </View>
            )}
          </View>

          {/* Empty past day message */}
          {isPast() && (!dayBudget || dayBudget.total === 0) && (
            <View style={[commonStyles.card, { backgroundColor: colors.card }]}>
              <View style={[commonStyles.center, { padding: 20 }]}>
                <Icon name="calendar-outline" size={48} color={colors.textSecondary} />
                <Text style={[commonStyles.text, { marginTop: 16, textAlign: 'center', color: colors.textSecondary }]}>
                  Aucune planification pour ce jour
                </Text>
                <Text style={[commonStyles.textSecondary, { marginTop: 8, textAlign: 'center', color: colors.textSecondary }]}>
                  Ce jour est passé et n'avait pas de repas planifiés
                </Text>
              </View>
            </View>
          )}

          {/* Meals - only show if day has data or is editable */}
          {(dayBudget || isEditable) && (
            <>
              <MealSection
                meal={getMealByType('morning')}
                title={t('morning')}
                icon="sunny"
                onAddItem={(item) => handleAddItem('morning', item)}
                onRemoveItem={(itemId) => handleRemoveItem('morning', itemId)}
                currency={t('currency')}
                disabled={!isEditable}
              />

              <MealSection
                meal={getMealByType('noon')}
                title={t('noon')}
                icon="sunny-outline"
                onAddItem={(item) => handleAddItem('noon', item)}
                onRemoveItem={(itemId) => handleRemoveItem('noon', itemId)}
                currency={t('currency')}
                disabled={!isEditable}
              />

              <MealSection
                meal={getMealByType('evening')}
                title={t('evening')}
                icon="moon"
                onAddItem={(item) => handleAddItem('evening', item)}
                onRemoveItem={(itemId) => handleRemoveItem('evening', itemId)}
                currency={t('currency')}
                disabled={!isEditable}
              />
            </>
          )}

          {/* Total and Actions - only show if day has data or is editable */}
          {(dayBudget || isEditable) && (
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
                <Text style={[commonStyles.textSecondary, { color: colors.textSecondary }]}>Niveau de dépense:</Text>
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
