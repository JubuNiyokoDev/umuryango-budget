import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import { useStyles } from '../styles/commonStyles';
import { useTranslation } from '../hooks/useTranslation';
import { usePlanningClipboard } from '../contexts/PlanningClipboardContext';
import Icon from './Icon';
import LoadingButton from './LoadingButton';
import { Meal } from '../types/budget';

interface PlanningActionsProps {
  currentDate: string;
  dayMeals: Meal[];
  onDuplicateToDate: (targetDate: string, meals: Meal[]) => void;
  onBulkPlan: (dates: string[], meals: Meal[]) => void;
  availableDates: string[];
  disabled?: boolean;
}

export default function PlanningActions({
  currentDate,
  dayMeals,
  onDuplicateToDate,
  onBulkPlan,
  availableDates,
  disabled = false
}: PlanningActionsProps) {
  const { colors, commonStyles } = useStyles();
  const { t } = useTranslation();
  const { copyDay, pasteData, hasCopiedData, getCopiedInfo } = usePlanningClipboard();
  
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [justCopied, setJustCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const hasMeals = dayMeals.some(meal => meal.items.length > 0);

  const handleCopyDay = () => {
    console.log('Copying day meals:', dayMeals);
    copyDay(currentDate, dayMeals);
    setJustCopied(true);
    setTimeout(() => setJustCopied(false), 2000);
  };

  const handlePasteDay = async () => {
    const clipboardData = pasteData();
    if (!clipboardData || clipboardData.type !== 'day') return;
    
    const mealsToApply = clipboardData.data as Meal[];
    console.log('Pasting day data:', mealsToApply);
    await onDuplicateToDate(currentDate, mealsToApply);
  };

  const handleDuplicateToSelected = () => {
    if (selectedDates.length === 0) {
      Alert.alert(t('error'), t('selectAtLeastOneDate'));
      return;
    }

    Alert.alert(
      t('duplicateDay'),
      t('duplicateToSelected').replace('{count}', selectedDates.length.toString()),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('duplicateDay'),
          onPress: async () => {
            setIsLoading(true);
            try {
              console.log('Starting duplication to:', selectedDates);
              console.log('Day meals to duplicate:', dayMeals);
              
              for (const date of selectedDates) {
                console.log('Duplicating to date:', date);
                await onDuplicateToDate(date, dayMeals);
              }
              
              setShowDuplicateModal(false);
              setSelectedDates([]);
              Alert.alert(t('success'), t('planningDuplicatedSuccessfully'));
            } catch (error) {
              console.error('Duplication error:', error);
              Alert.alert(t('error'), 'Erreur lors de la duplication: ' + error);
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleBulkPlan = async () => {
    if (selectedDates.length === 0) {
      Alert.alert(t('error'), t('selectAtLeastOneDate'));
      return;
    }

    setIsLoading(true);
    try {
      console.log('Starting bulk planning for:', selectedDates);
      console.log('Day meals for bulk:', dayMeals);
      
      await onBulkPlan(selectedDates, dayMeals);
      setShowBulkModal(false);
      setSelectedDates([]);
      Alert.alert(t('success'), t('planningAppliedToMultipleDays').replace('{count}', selectedDates.length.toString()));
    } catch (error) {
      console.error('Bulk planning error:', error);
      Alert.alert(t('error'), 'Erreur lors de la planification: ' + error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDateSelection = (date: string) => {
    setSelectedDates(prev => 
      prev.includes(date) 
        ? prev.filter(d => d !== date)
        : [...prev, date]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const canPasteDay = () => {
    const clipboardData = pasteData();
    return clipboardData?.type === 'day';
  };

  const getEditableDates = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return availableDates.filter(dateString => {
      const date = new Date(dateString);
      date.setHours(0, 0, 0, 0);
      return date >= today; // Seulement les dates d'aujourd'hui et futures
    });
  };

  if (disabled) return null;

  return (
    <View style={[commonStyles.card, { backgroundColor: colors.card }]}>
      <Text style={[commonStyles.subtitle, { color: colors.text, marginBottom: 12 }]}>
        {t('planningActions')}
      </Text>
      
      <View style={styles.actionsRow}>
        {/* Copier journée */}
        {hasMeals && (
          <TouchableOpacity
            onPress={handleCopyDay}
            style={[
              styles.actionCard,
              { 
                backgroundColor: justCopied ? colors.success + '20' : colors.primary + '20',
                borderColor: justCopied ? colors.success : colors.primary
              }
            ]}
          >
            <Icon 
              name={justCopied ? "checkmark-circle" : "copy"} 
              size={20} 
              color={justCopied ? colors.success : colors.primary} 
            />
            <Text style={[styles.actionText, { color: justCopied ? colors.success : colors.primary }]}>
              {justCopied ? t('copied') : t('copy')}
            </Text>
          </TouchableOpacity>
        )}

        {/* Coller journée */}
        {canPasteDay() && (
          <TouchableOpacity
            onPress={handlePasteDay}
            style={[styles.actionCard, { backgroundColor: colors.success + '20', borderColor: colors.success }]}
          >
            <Icon name="clipboard" size={20} color={colors.success} />
            <Text style={[styles.actionText, { color: colors.success }]}>
              {t('paste')}
            </Text>
          </TouchableOpacity>
        )}

        {/* Duplication intelligente */}
        {hasMeals && (
          <TouchableOpacity
            onPress={() => setShowDuplicateModal(true)}
            style={[styles.actionCard, { backgroundColor: colors.warning + '20', borderColor: colors.warning }]}
          >
            <Icon name="repeat" size={20} color={colors.warning} />
            <Text style={[styles.actionText, { color: colors.warning }]}>
              {t('duplicate')}
            </Text>
          </TouchableOpacity>
        )}

        {/* Planification par lot */}
        <TouchableOpacity
          onPress={() => setShowBulkModal(true)}
          style={[styles.actionCard, { backgroundColor: colors.secondary + '20', borderColor: colors.secondary }]}
        >
          <Icon name="calendar" size={20} color={colors.secondary} />
          <Text style={[styles.actionText, { color: colors.secondary }]}>
            {t('bulkPlan')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Info clipboard */}
      {hasCopiedData() && (
        <View style={[styles.clipboardInfo, { backgroundColor: colors.backgroundAlt, borderColor: colors.border }]}>
          <Icon name="information-circle" size={16} color={colors.primary} />
          <Text style={[styles.clipboardText, { color: colors.textSecondary }]}>
            {t('clipboardInfo').replace('{info}', getCopiedInfo() || '')}
          </Text>
        </View>
      )}

      {/* Modal Duplication */}
      <Modal
        visible={showDuplicateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDuplicateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[commonStyles.title, { color: colors.text, marginBottom: 16 }]}>
              {t('duplicateTo')}
            </Text>
            
            <ScrollView style={{ maxHeight: 300 }}>
              {getEditableDates().filter(date => date !== currentDate).map(date => (
                <TouchableOpacity
                  key={date}
                  onPress={() => toggleDateSelection(date)}
                  style={[
                    styles.dateOption,
                    { 
                      backgroundColor: selectedDates.includes(date) ? colors.primary + '20' : 'transparent',
                      borderColor: colors.border
                    }
                  ]}
                >
                  <Text style={[commonStyles.text, { color: colors.text }]}>
                    {formatDate(date)}
                  </Text>
                  {selectedDates.includes(date) && (
                    <Icon name="checkmark-circle" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalActions}>
              <LoadingButton
                title={t('cancel')}
                onPress={() => {
                  setShowDuplicateModal(false);
                  setSelectedDates([]);
                }}
                variant="secondary"
                style={{ flex: 1 }}
              />
              <LoadingButton
                title={`${t('duplicate')} (${selectedDates.length})`}
                onPress={handleDuplicateToSelected}
                style={{ flex: 1 }}
                disabled={selectedDates.length === 0 || isLoading}
                loading={isLoading}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Planification par lot */}
      <Modal
        visible={showBulkModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowBulkModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[commonStyles.title, { color: colors.text, marginBottom: 16 }]}>
              {t('planMultipleDays')}
            </Text>
            
            <ScrollView style={{ maxHeight: 300 }}>
              {getEditableDates().map(date => (
                <TouchableOpacity
                  key={date}
                  onPress={() => toggleDateSelection(date)}
                  style={[
                    styles.dateOption,
                    { 
                      backgroundColor: selectedDates.includes(date) ? colors.secondary + '20' : 'transparent',
                      borderColor: colors.border
                    }
                  ]}
                >
                  <Text style={[commonStyles.text, { color: colors.text }]}>
                    {formatDate(date)}
                  </Text>
                  {selectedDates.includes(date) && (
                    <Icon name="checkmark-circle" size={20} color={colors.secondary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalActions}>
              <LoadingButton
                title={t('cancel')}
                onPress={() => {
                  setShowBulkModal(false);
                  setSelectedDates([]);
                }}
                variant="secondary"
                style={{ flex: 1 }}
              />
              <LoadingButton
                title={`${t('bulkPlan')} (${selectedDates.length})`}
                onPress={handleBulkPlan}
                style={{ flex: 1 }}
                disabled={selectedDates.length === 0 || isLoading}
                loading={isLoading}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = {
  actionsRow: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 8,
  },
  actionCard: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  clipboardInfo: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginTop: 12,
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    gap: 6,
  },
  clipboardText: {
    fontSize: 12,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 12,
    padding: 20,
  },
  dateOption: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  modalActions: {
    flexDirection: 'row' as const,
    gap: 12,
    marginTop: 16,
  },
};