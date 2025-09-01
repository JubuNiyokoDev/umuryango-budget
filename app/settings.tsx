import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStyles } from '../styles/commonStyles';
import { useTranslation } from '../hooks/useTranslation';
import { useTheme, ThemeMode } from '../hooks/useTheme';
import { usePin } from '../hooks/usePin';
import { useBudget } from '../hooks/useBudget';
import { useForceUpdate } from '../hooks/useForceUpdate';
import Icon from '../components/Icon';
import LoadingButton from '../components/LoadingButton';
import PinModal from '../components/PinModal';
import DataDeletionModal from '../components/DataDeletionModal';
import { useImportExport } from '../hooks/useImportExport';

export default function SettingsScreen() {
  const { language, changeLanguage, t } = useTranslation();
  const { themeMode, changeTheme } = useTheme();
  const { hasPin, setPin, verifyPin, removePin } = usePin();
  const { budgetHistory, refreshData } = useBudget();
  const {
    exportLoading,
    importLoading,
    exportData,
    importData,
    listSavedExports,
  } = useImportExport();
  const { colors, commonStyles } = useStyles();
  const forceUpdate = useForceUpdate();

  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [pinModalMode, setPinModalMode] = useState<'create' | 'verify'>(
    'create',
  );
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [pendingDeletion, setPendingDeletion] = useState<{
    monthIds: string[];
    requirePin: boolean;
  } | null>(null);

  const handleLanguageChange = () => {
    Alert.alert(t('language'), 'Choisissez votre langue préférée', [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('french'),
        onPress: () => {
          changeLanguage('fr');
        },
      },
      {
        text: t('kirundi'),
        onPress: () => {
          changeLanguage('rn');
        },
      },
    ]);
  };

  const handleThemeChange = () => {
    Alert.alert(t('theme'), 'Choisissez votre thème préféré', [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('light'),
        onPress: () => changeTheme('light'),
      },
      {
        text: t('dark'),
        onPress: () => changeTheme('dark'),
      },
      {
        text: t('system'),
        onPress: () => changeTheme('system'),
      },
    ]);
  };

  const handlePinSetup = () => {
    if (hasPin) {
      Alert.alert(t('pin') + ' de sécurité', t('whatWouldYouLikeToDo'), [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('modifyPin'),
          onPress: () => {
            setPinModalMode('verify');
            setPinModalVisible(true);
          },
        },
        {
          text: t('deletePin'),
          style: 'destructive',
          onPress: () => {
            setPinModalMode('verify');
            setPinModalVisible(true);
          },
        },
      ]);
    } else {
      setPinModalMode('create');
      setPinModalVisible(true);
    }
  };

  const handlePinVerified = async (pin: string) => {
    const isValid = await verifyPin(pin);
    if (isValid) {
      // If we have a pending deletion, execute it
      if (pendingDeletion) {
        setPinModalVisible(false);
        await executeDeletion(
          pendingDeletion.monthIds,
          pendingDeletion.requirePin,
        );
        setPendingDeletion(null);
        return true;
      }

      // Otherwise, show PIN management options
      Alert.alert(t('pinVerified'), t('whatWouldYouLikeToDo'), [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('modifyPin'),
          onPress: () => {
            setPinModalMode('create');
            setPinModalVisible(true);
          },
        },
        {
          text: t('deletePin'),
          style: 'destructive',
          onPress: async () => {
            const success = await removePin();
            if (success) {
              Alert.alert(t('success'), t('pinDeletedSuccessfully'));
            }
          },
        },
      ]);
      return true;
    }
    return false;
  };

  const executeDeletion = async (monthIds: string[], requirePin: boolean) => {
    try {
      if (monthIds.length === budgetHistory.monthlyBudgets.length) {
        // Delete ALL data including PIN, theme, etc.
        await AsyncStorage.clear();
        Alert.alert(t('success'), t('allDataDeleted'), [
          {
            text: 'OK',
            onPress: () => {
              // Force app restart by navigating to a fresh state
              router.replace('/');
            },
          },
        ]);
      } else {
        // Delete specific months and update history
        for (const monthId of monthIds) {
          await AsyncStorage.removeItem(`@budget_data_${monthId}`);
          await AsyncStorage.removeItem(`budget_data_${monthId}`);
        }

        // Update history to remove deleted months
        const updatedHistory = {
          ...budgetHistory,
          monthlyBudgets: budgetHistory.monthlyBudgets.filter(
            b => !monthIds.includes(b.id),
          ),
        };
        await AsyncStorage.setItem(
          '@budget_history',
          JSON.stringify(updatedHistory),
        );

        Alert.alert(t('success'), t('dataDeletedSuccessfully'));
        await refreshData();
        router.replace('/home');
      }
    } catch (error) {
      console.log('Error deleting data:', error);
      throw error;
    }
  };

  const handlePinCreated = async (pin: string) => {
    const success = await setPin(pin);
    if (success) {
      Alert.alert(t('success'), t('pinCreatedSuccessfully'));
      return true;
    }
    return false;
  };

  const handleDataDeletion = () => {
    setDeleteModalVisible(true);
  };

  const handleExportData = async () => {
    Alert.alert(
      t('exportData'),
      t('exportDataDescription'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('exportData'),
          onPress: async () => {
            const success = await exportData();
            if (!success) {
              Alert.alert(t('error'), t('cannotExportData'));
            }
          },
        },
      ],
    );
  };

  const handleImportData = async () => {
    Alert.alert(
      t('importData'),
      `${t('importDescription')}\n\n${t('dataWillBeMerged')}\n${t(
        'newDataPriority',
      )}`,
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('importData'),
          onPress: async () => {
            const success = await importData();
            if (success) {
              Alert.alert(t('success'), t('importSuccess'), [
                {
                  text: 'OK',
                  onPress: () => {
                    refreshData();
                    router.replace('/home');
                  },
                },
              ]);
            } else {
              Alert.alert(t('error'), t('invalidFile'));
            }
          },
        },
      ],
    );
  };

  const handleDeleteData = async (monthIds: string[], requirePin: boolean) => {
    if (!hasPin) {
      Alert.alert(t('error'), t('pinRequiredForDeletion'));
      return;
    }

    // Store deletion request and show PIN verification
    setPendingDeletion({ monthIds, requirePin });
    setPinModalMode('verify');
    setPinModalVisible(true);
  };

  const availableMonths = budgetHistory.monthlyBudgets.map(budget => ({
    id: budget.id,
    displayName: `${budget.month} ${budget.year}`,
  }));

  return (
    <View
      style={[commonStyles.container, { backgroundColor: colors.background }]}
    >
      <View style={commonStyles.content}>
        <View style={[commonStyles.row, { marginBottom: 20 }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text
            style={[
              commonStyles.title,
              { flex: 1, textAlign: 'center', color: colors.text },
            ]}
          >
            {t('settings')}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Language Settings */}
          <View style={[commonStyles.card, { backgroundColor: colors.card }]}>
            <Text style={[commonStyles.subtitle, { color: colors.text }]}>
              {t('language')} / Ururimi
            </Text>
            <TouchableOpacity
              style={[commonStyles.row, { marginTop: 16 }]}
              onPress={handleLanguageChange}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon
                  name="language-outline"
                  size={20}
                  color={colors.primary}
                />
                <Text
                  style={[
                    commonStyles.text,
                    { marginLeft: 12, color: colors.text },
                  ]}
                >
                  {t('currentLanguage')}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text
                  style={[
                    commonStyles.text,
                    { color: colors.primary, marginRight: 8 },
                  ]}
                >
                  {language === 'fr' ? t('french') : t('kirundi')}
                </Text>
                <Icon
                  name="chevron-forward"
                  size={16}
                  color={colors.textSecondary}
                />
              </View>
            </TouchableOpacity>
          </View>

          {/* Theme Settings */}
          <View style={[commonStyles.card, { backgroundColor: colors.card }]}>
            <Text style={[commonStyles.subtitle, { color: colors.text }]}>
              {t('appearance')}
            </Text>
            <TouchableOpacity
              style={[commonStyles.row, { marginTop: 16 }]}
              onPress={handleThemeChange}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon
                  name="color-palette-outline"
                  size={20}
                  color={colors.primary}
                />
                <Text
                  style={[
                    commonStyles.text,
                    { marginLeft: 12, color: colors.text },
                  ]}
                >
                  {t('theme')}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text
                  style={[
                    commonStyles.text,
                    { color: colors.primary, marginRight: 8 },
                  ]}
                >
                  {themeMode === 'light'
                    ? t('light')
                    : themeMode === 'dark'
                    ? t('dark')
                    : t('system')}
                </Text>
                <Icon
                  name="chevron-forward"
                  size={16}
                  color={colors.textSecondary}
                />
              </View>
            </TouchableOpacity>
          </View>

          {/* Security Settings */}
          <View style={[commonStyles.card, { backgroundColor: colors.card }]}>
            <Text style={[commonStyles.subtitle, { color: colors.text }]}>
              {t('security')}
            </Text>
            <TouchableOpacity
              style={[commonStyles.row, { marginTop: 16 }]}
              onPress={handlePinSetup}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon
                  name="shield-checkmark"
                  size={20}
                  color={colors.primary}
                />
                <Text
                  style={[
                    commonStyles.text,
                    { marginLeft: 12, color: colors.text },
                  ]}
                >
                  {t('pin')} de sécurité
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text
                  style={[
                    commonStyles.text,
                    {
                      color: hasPin ? colors.success : colors.textSecondary,
                      marginRight: 8,
                    },
                  ]}
                >
                  {hasPin ? t('configured') : t('notConfigured')}
                </Text>
                <Icon
                  name="chevron-forward"
                  size={16}
                  color={colors.textSecondary}
                />
              </View>
            </TouchableOpacity>
          </View>

          {/* Import/Export */}
          <View style={[commonStyles.card, { backgroundColor: colors.card }]}>
            <Text style={[commonStyles.subtitle, { color: colors.text }]}>
              {t('importExport')}
            </Text>
            <Text
              style={[
                commonStyles.textSecondary,
                { marginTop: 8, color: colors.textSecondary },
              ]}
            >
              {t('exportDescription')}
            </Text>

            <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
              <LoadingButton
                title={t('exportData')}
                onPress={handleExportData}
                style={{ flex: 1 }}
                icon="share-outline"
                loading={exportLoading}
                disabled={exportLoading || importLoading}
              />
              <LoadingButton
                title={t('importData')}
                onPress={handleImportData}
                variant="secondary"
                style={{ flex: 1 }}
                icon="download-outline"
                loading={importLoading}
                disabled={exportLoading || importLoading}
              />
            </View>
          </View>

          {/* Data Management */}
          <View style={[commonStyles.card, { backgroundColor: colors.card }]}>
            <Text style={[commonStyles.subtitle, { color: colors.text }]}>
              {t('dataManagement')}
            </Text>
            <Text
              style={[
                commonStyles.textSecondary,
                { marginTop: 8, color: colors.textSecondary },
              ]}
            >
              {t('localDataStorage')}
            </Text>

            <LoadingButton
              title={t('deleteDataButton')}
              onPress={handleDataDeletion}
              variant="danger"
              style={{ marginTop: 16 }}
              icon="trash"
            />
          </View>

          {/* About */}
          <View style={[commonStyles.card, { backgroundColor: colors.card }]}>
            <Text style={[commonStyles.subtitle, { color: colors.text }]}>
              {t('about')}
            </Text>
            <View style={[commonStyles.row, { marginTop: 16 }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon
                  name="information-circle-outline"
                  size={20}
                  color={colors.primary}
                />
                <Text
                  style={[
                    commonStyles.text,
                    { marginLeft: 12, color: colors.text },
                  ]}
                >
                  {t('version')}
                </Text>
              </View>
              <Text
                style={[
                  commonStyles.textSecondary,
                  { color: colors.textSecondary },
                ]}
              >
                1.0.0
              </Text>
            </View>

            <View style={[commonStyles.row, { marginTop: 12 }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="heart-outline" size={20} color={colors.primary} />
                <Text
                  style={[
                    commonStyles.text,
                    { marginLeft: 12, color: colors.text },
                  ]}
                >
                  {t('developedWith')}
                </Text>
              </View>
              <Text
                style={[
                  commonStyles.textSecondary,
                  { color: colors.textSecondary },
                ]}
              >
                React Native
              </Text>
            </View>

            <View style={[commonStyles.row, { marginTop: 12 }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="person-outline" size={20} color={colors.primary} />
                <Text
                  style={[
                    commonStyles.text,
                    { marginLeft: 12, color: colors.text },
                  ]}
                >
                  Développé par
                </Text>
              </View>
              <Text
                style={[
                  commonStyles.textSecondary,
                  { color: colors.textSecondary },
                ]}
              >
                Niyondiko Joffre
              </Text>
            </View>
          </View>

          {/* Features */}
          <View style={[commonStyles.card, { backgroundColor: colors.card }]}>
            <Text style={[commonStyles.subtitle, { color: colors.text }]}>
              {t('features')}
            </Text>
            <View style={{ marginTop: 12 }}>
              <Text
                style={[
                  commonStyles.textSecondary,
                  { color: colors.textSecondary },
                ]}
              >
                {t('interactiveCalendar')}
              </Text>
              <Text
                style={[
                  commonStyles.textSecondary,
                  { color: colors.textSecondary },
                ]}
              >
                {t('dailyMealTracking')}
              </Text>
              <Text
                style={[
                  commonStyles.textSecondary,
                  { color: colors.textSecondary },
                ]}
              >
                {t('monthlyBudgetManagement')}
              </Text>
              <Text
                style={[
                  commonStyles.textSecondary,
                  { color: colors.textSecondary },
                ]}
              >
                {t('expenseHistory')}
              </Text>
              <Text
                style={[
                  commonStyles.textSecondary,
                  { color: colors.textSecondary },
                ]}
              >
                {t('multilingualSupport')}
              </Text>
              <Text
                style={[
                  commonStyles.textSecondary,
                  { color: colors.textSecondary },
                ]}
              >
                {t('secureLocalStorage')}
              </Text>
              <Text
                style={[
                  commonStyles.textSecondary,
                  { color: colors.textSecondary },
                ]}
              >
                {t('lightDarkThemes')}
              </Text>
              <Text
                style={[
                  commonStyles.textSecondary,
                  { color: colors.textSecondary },
                ]}
              >
                {t('pinProtection')}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* PIN Modal */}
      <PinModal
        visible={pinModalVisible}
        onClose={() => {
          setPinModalVisible(false);
          setPendingDeletion(null);
        }}
        onSuccess={() => setPinModalVisible(false)}
        title="Vérifier le PIN"
        description="Entrez votre PIN de sécurité"
        mode={pinModalMode}
        onPinVerified={handlePinVerified}
        onPinCreated={handlePinCreated}
      />

      {/* Data Deletion Modal */}
      <DataDeletionModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onDelete={handleDeleteData}
        availableMonths={availableMonths}
      />
    </View>
  );
}
