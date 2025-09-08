
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, StyleSheet, Animated } from 'react-native';
import { useStyles } from '../styles/commonStyles';
import { useTranslation } from '../hooks/useTranslation';
import { usePlanningClipboard } from '../contexts/PlanningClipboardContext';
import Icon from './Icon';
import LoadingButton from './LoadingButton';
import { Meal, MealItem } from '../types/budget';

interface MealSectionProps {
  meal: Meal;
  title: string;
  icon: string;
  onAddItem: (item: Omit<MealItem, 'id'>) => void;
  onRemoveItem: (itemId: string) => void;
  onPasteMeal?: (meal: Meal) => void;
  currency: string;
  disabled?: boolean;
  currentDate?: string;
}

export default function MealSection({
  meal,
  title,
  icon,
  onAddItem,
  onRemoveItem,
  onPasteMeal,
  currency,
  disabled = false,
  currentDate
}: MealSectionProps) {
  const { colors, commonStyles } = useStyles();
  const { t } = useTranslation();
  const { copyMeal, pasteData, hasCopiedData, getCopiedInfo } = usePlanningClipboard();
  const [showAddForm, setShowAddForm] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [copyAnimation] = useState(new Animated.Value(1));
  const [justCopied, setJustCopied] = useState(false);

  const handleAddItem = async () => {
    if (!itemName.trim() || !itemPrice.trim()) {
      Alert.alert(t('error'), t('fillAllFields'));
      return;
    }

    const price = parseFloat(itemPrice);
    if (isNaN(price) || price <= 0) {
      Alert.alert(t('error'), t('pleaseEnterValidPrice'));
      return;
    }

    onAddItem({
      name: itemName.trim(),
      price: price,
    });

    setItemName('');
    setItemPrice('');
    setShowAddForm(false);
  };

  const handleRemoveItem = (itemId: string) => {
    Alert.alert(
      t('deleteItem'),
      t('confirmDeleteItem'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: () => onRemoveItem(itemId),
        },
      ]
    );
  };

  const handleCopyMeal = () => {
    if (!currentDate) return;
    
    copyMeal(currentDate, meal);
    setJustCopied(true);
    
    // Animation de feedback
    Animated.sequence([
      Animated.timing(copyAnimation, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(copyAnimation, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      })
    ]).start();
    
    // Reset après 2 secondes
    setTimeout(() => setJustCopied(false), 2000);
  };

  const handlePasteMeal = () => {
    const clipboardData = pasteData();
    if (!clipboardData || clipboardData.type !== 'meal' || !onPasteMeal) return;
    
    const mealToPaste = clipboardData.data as Meal;
    if (mealToPaste.type !== meal.type) {
      Alert.alert(t('error'), t('cannotPasteDifferentMealType'));
      return;
    }
    
    if (meal.items.length > 0) {
      Alert.alert(
        t('replaceContent'),
        t('mealAlreadyHasItems'),
        [
          { text: t('cancel'), style: 'cancel' },
          {
            text: t('replace'),
            style: 'destructive',
            onPress: () => onPasteMeal(mealToPaste),
          },
        ]
      );
    } else {
      onPasteMeal(mealToPaste);
    }
  };

  const canPaste = () => {
    const clipboardData = pasteData();
    if (!clipboardData || clipboardData.type !== 'meal') return false;
    
    const copiedMeal = clipboardData.data as Meal;
    
    // Permettre le collage si :
    // 1. C'est le même type de repas d'un autre jour
    // 2. OU c'est un type différent du même jour (matin -> midi, midi -> soir, etc.)
    return (copiedMeal.type === meal.type && clipboardData.date !== currentDate) ||
           (copiedMeal.type !== meal.type && clipboardData.date === currentDate);
  };

  return (
    <View style={[commonStyles.card, { backgroundColor: colors.card }]}>
      <View style={[commonStyles.row, { marginBottom: 16 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon name={icon as any} size={24} color={colors.primary} />
          <Text style={[commonStyles.subtitle, { marginLeft: 8, marginBottom: 0, color: colors.text }]}>
            {title}
          </Text>
        </View>
        
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={[styles.totalText, { color: colors.primary }]}>
            {meal.total.toLocaleString()} {currency}
          </Text>
          
          {!disabled && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              {/* Bouton Coller */}
              {canPaste() && (
                <TouchableOpacity
                  onPress={handlePasteMeal}
                  style={[styles.actionButton, { backgroundColor: colors.success + '20' }]}
                >
                  <Icon name="clipboard" size={16} color={colors.success} />
                </TouchableOpacity>
              )}
              
              {/* Bouton Copier avec animation */}
              {meal.items.length > 0 && (
                <Animated.View style={{ transform: [{ scale: copyAnimation }] }}>
                  <TouchableOpacity
                    onPress={handleCopyMeal}
                    style={[
                      styles.actionButton, 
                      { 
                        backgroundColor: justCopied ? colors.success + '20' : colors.primary + '20'
                      }
                    ]}
                  >
                    <Icon 
                      name={justCopied ? "checkmark" : "copy"} 
                      size={16} 
                      color={justCopied ? colors.success : colors.primary} 
                    />
                  </TouchableOpacity>
                </Animated.View>
              )}
              
              {/* Bouton Ajouter */}
              <TouchableOpacity
                onPress={() => setShowAddForm(!showAddForm)}
              >
                <Icon 
                  name={showAddForm ? "remove-circle" : "add-circle"} 
                  size={20} 
                  color={colors.primary} 
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Items List */}
      {meal.items.map((item) => (
        <View key={item.id} style={[styles.itemRow, { borderBottomColor: colors.border }]}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
            {item.contributor && (
              <Text style={[styles.contributor, { color: colors.textSecondary }]}>
                {t('by')}: {item.contributor}
              </Text>
            )}
          </View>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={[styles.itemPrice, { color: colors.success }]}>
              {item.price.toLocaleString()} {currency}
            </Text>
            {!disabled && (
              <TouchableOpacity
                onPress={() => handleRemoveItem(item.id)}
                style={[styles.removeButton, { backgroundColor: colors.error + '20' }]}
              >
                <Icon name="trash" size={14} color={colors.error} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}

      {meal.items.length === 0 && (
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          {t('noItemsAdded')}
        </Text>
      )}

      {/* Add Item Form */}
      {showAddForm && !disabled && (
        <View style={[styles.addForm, { backgroundColor: colors.backgroundAlt, borderColor: colors.border }]}>
          <TextInput
            style={[commonStyles.input, { backgroundColor: colors.backgroundAlt, borderColor: colors.border, color: colors.text }]}
            placeholder={t('itemName')}
            placeholderTextColor={colors.textSecondary}
            value={itemName}
            onChangeText={setItemName}
          />
          
          <TextInput
            style={[commonStyles.input, { marginTop: 8, backgroundColor: colors.backgroundAlt, borderColor: colors.border, color: colors.text }]}
            placeholder={`${t('price')} (${currency})`}
            placeholderTextColor={colors.textSecondary}
            value={itemPrice}
            onChangeText={setItemPrice}
            keyboardType="numeric"
          />
          
          <View style={styles.formActions}>
            <LoadingButton
              title={t('cancel')}
              onPress={() => {
                setShowAddForm(false);
                setItemName('');
                setItemPrice('');
              }}
              variant="secondary"
              style={{ flex: 1 }}
            />
            <LoadingButton
              title={t('add')}
              onPress={handleAddItem}
              style={{ flex: 1 }}
              icon="add"
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  totalText: {
    fontSize: 16,
    fontWeight: '700',
  },
  actionButton: {
    padding: 6,
    borderRadius: 6,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  contributor: {
    fontSize: 10,
    fontStyle: 'italic',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
  },
  removeButton: {
    padding: 4,
    borderRadius: 4,
  },
  emptyText: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginVertical: 8,
  },
  addForm: {
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  formActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
});
