
import React, { useState } from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useStyles } from '../styles/commonStyles';
import { useTranslation } from '../hooks/useTranslation';
import LoadingButton from './LoadingButton';
import Icon from './Icon';

interface DataDeletionModalProps {
  visible: boolean;
  onClose: () => void;
  onDelete: (months: string[], requirePin: boolean) => Promise<void>;
  availableMonths: Array<{ id: string; displayName: string }>;
}

export default function DataDeletionModal({
  visible,
  onClose,
  onDelete,
  availableMonths
}: DataDeletionModalProps) {
  const { colors } = useStyles();
  const { t } = useTranslation();
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [deleteAll, setDeleteAll] = useState(false);

  const handleMonthToggle = (monthId: string) => {
    setSelectedMonths(prev => 
      prev.includes(monthId) 
        ? prev.filter(id => id !== monthId)
        : [...prev, monthId]
    );
  };

  const handleDeleteAllToggle = () => {
    setDeleteAll(!deleteAll);
    if (!deleteAll) {
      setSelectedMonths([]);
    }
  };

  const handleDelete = async () => {
    const monthsToDelete = deleteAll ? availableMonths.map(m => m.id) : selectedMonths;
    
    if (monthsToDelete.length === 0) {
      Alert.alert('Erreur', 'Veuillez sélectionner au moins un mois à supprimer');
      return;
    }

    const monthNames = deleteAll 
      ? ['toutes les données']
      : monthsToDelete.map(id => availableMonths.find(m => m.id === id)?.displayName).filter(Boolean);

    Alert.alert(
      'Confirmer la suppression',
      `Êtes-vous sûr de vouloir supprimer ${monthNames.join(', ')} ?\n\nCette action est irréversible.`,
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await onDelete(monthsToDelete, true);
              resetModal();
            } catch (error) {
              console.log('Delete error:', error);
              Alert.alert('Erreur', 'Impossible de supprimer les données');
            }
          },
        },
      ]
    );
  };

  const resetModal = () => {
    setSelectedMonths([]);
    setDeleteAll(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={resetModal}
    >
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: colors.card }]}>
          <View style={styles.header}>
            <Icon name="trash" size={32} color={colors.error} />
            <Text style={[styles.title, { color: colors.text }]}>
              Supprimer les données
            </Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              Sélectionnez les données à supprimer. Votre PIN sera requis pour confirmer.
            </Text>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Delete All Option */}
            <TouchableOpacity
              style={[
                styles.option,
                {
                  backgroundColor: deleteAll ? colors.error + '20' : colors.backgroundAlt,
                  borderColor: deleteAll ? colors.error : colors.border,
                }
              ]}
              onPress={handleDeleteAllToggle}
            >
              <View style={styles.optionContent}>
                <Icon 
                  name={deleteAll ? "checkbox" : "square-outline"} 
                  size={20} 
                  color={deleteAll ? colors.error : colors.textSecondary} 
                />
                <View style={styles.optionText}>
                  <Text style={[styles.optionTitle, { color: deleteAll ? colors.error : colors.text }]}>
                    Supprimer toutes les données
                  </Text>
                  <Text style={[styles.optionSubtitle, { color: colors.textSecondary }]}>
                    Efface complètement l'historique et toutes les données
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Individual Months */}
            {!deleteAll && (
              <>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Ou sélectionnez des mois spécifiques:
                </Text>
                
                {availableMonths.map((month) => (
                  <TouchableOpacity
                    key={month.id}
                    style={[
                      styles.monthOption,
                      {
                        backgroundColor: selectedMonths.includes(month.id) 
                          ? colors.primary + '20' 
                          : colors.backgroundAlt,
                        borderColor: selectedMonths.includes(month.id) 
                          ? colors.primary 
                          : colors.border,
                      }
                    ]}
                    onPress={() => handleMonthToggle(month.id)}
                  >
                    <Icon 
                      name={selectedMonths.includes(month.id) ? "checkbox" : "square-outline"} 
                      size={20} 
                      color={selectedMonths.includes(month.id) ? colors.primary : colors.textSecondary} 
                    />
                    <Text style={[
                      styles.monthText, 
                      { 
                        color: selectedMonths.includes(month.id) ? colors.primary : colors.text 
                      }
                    ]}>
                      {month.displayName}
                    </Text>
                  </TouchableOpacity>
                ))}
              </>
            )}
          </ScrollView>

          <View style={styles.actions}>
            <LoadingButton
              title={t('cancel')}
              onPress={resetModal}
              variant="secondary"
              style={{ flex: 1 }}
            />
            <LoadingButton
              title="Supprimer"
              onPress={handleDelete}
              variant="danger"
              style={{ flex: 1 }}
              icon="trash"
            />
          </View>
        </View>
      </View>
    </Modal>
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
    maxHeight: '80%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  content: {
    maxHeight: 300,
    marginBottom: 24,
  },
  option: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    marginLeft: 12,
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 12,
    lineHeight: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 16,
  },
  monthOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  monthText: {
    fontSize: 14,
    marginLeft: 12,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
});
