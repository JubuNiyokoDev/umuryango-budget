
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, StyleSheet } from 'react-native';
import { useStyles } from '../styles/commonStyles';
import Icon from './Icon';
import LoadingButton from './LoadingButton';
import { Meal, MealItem } from '../types/budget';

interface MealSectionProps {
  meal: Meal;
  title: string;
  icon: string;
  onAddItem: (item: Omit<MealItem, 'id'>) => void;
  onRemoveItem: (itemId: string) => void;
  currency: string;
  disabled?: boolean;
}

export default function MealSection({
  meal,
  title,
  icon,
  onAddItem,
  onRemoveItem,
  currency,
  disabled = false
}: MealSectionProps) {
  const { colors, commonStyles } = useStyles();
  const [showAddForm, setShowAddForm] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');

  const handleAddItem = async () => {
    if (!itemName.trim() || !itemPrice.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    const price = parseFloat(itemPrice);
    if (isNaN(price) || price <= 0) {
      Alert.alert('Erreur', 'Veuillez entrer un prix valide');
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
      'Supprimer l\'article',
      'Êtes-vous sûr de vouloir supprimer cet article?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => onRemoveItem(itemId),
        },
      ]
    );
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
            <TouchableOpacity
              onPress={() => setShowAddForm(!showAddForm)}
              style={{ opacity: disabled ? 0.5 : 1 }}
            >
              <Icon 
                name={showAddForm ? "remove-circle" : "add-circle"} 
                size={20} 
                color={colors.primary} 
              />
            </TouchableOpacity>
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
                Par: {item.contributor}
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
          Aucun article ajouté
        </Text>
      )}

      {/* Add Item Form */}
      {showAddForm && !disabled && (
        <View style={[styles.addForm, { backgroundColor: colors.backgroundAlt, borderColor: colors.border }]}>
          <TextInput
            style={[commonStyles.input, { backgroundColor: colors.backgroundAlt, borderColor: colors.border, color: colors.text }]}
            placeholder="Nom de l'article"
            placeholderTextColor={colors.textSecondary}
            value={itemName}
            onChangeText={setItemName}
          />
          
          <TextInput
            style={[commonStyles.input, { marginTop: 8, backgroundColor: colors.backgroundAlt, borderColor: colors.border, color: colors.text }]}
            placeholder={`Prix (${currency})`}
            placeholderTextColor={colors.textSecondary}
            value={itemPrice}
            onChangeText={setItemPrice}
            keyboardType="numeric"
          />
          
          <View style={styles.formActions}>
            <LoadingButton
              title="Annuler"
              onPress={() => {
                setShowAddForm(false);
                setItemName('');
                setItemPrice('');
              }}
              variant="secondary"
              style={{ flex: 1 }}
            />
            <LoadingButton
              title="Ajouter"
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
