import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Share, Platform, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { BudgetHistory, MonthlyBudget } from '../types/budget';

import { showToast } from '../components/Toast';

interface ExportData {
  version: string;
  exportDate: string;
  budgetHistory: BudgetHistory;
  monthlyBudgets: { [key: string]: MonthlyBudget };
}

export const useImportExport = () => {
  const [exportLoading, setExportLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  
  // Fonction pour créer un dossier UmuryangoBudget accessible
  const createUmuryangoBudgetFolder = async (): Promise<string | null> => {
    try {
      if (Platform.OS === 'android') {
        // Essayer de créer dans le dossier Documents accessible
        const documentsDir = FileSystem.documentDirectory + 'UmuryangoBudget/';
        
        const dirInfo = await FileSystem.getInfoAsync(documentsDir);
        if (!dirInfo.exists) {
          await FileSystem.makeDirectoryAsync(documentsDir, { intermediates: true });
        }
        
        return documentsDir;
      } else {
        // Pour iOS, utiliser le dossier Documents
        const documentsDir = FileSystem.documentDirectory + 'UmuryangoBudget/';
        
        const dirInfo = await FileSystem.getInfoAsync(documentsDir);
        if (!dirInfo.exists) {
          await FileSystem.makeDirectoryAsync(documentsDir, { intermediates: true });
        }
        
        return documentsDir;
      }
    } catch (error) {
      console.error('Error creating UmuryangoBudget folder:', error);
      return null;
    }
  };
  // Fonction pour sauvegarder dans un dossier accessible (comme WhatsApp)
  const saveToUmuryangoBudget = async (fileName: string, content: string): Promise<boolean> => {
    try {
      // Créer le fichier dans le cache d'abord
      const fileUri = FileSystem.cacheDirectory + fileName;
      await FileSystem.writeAsStringAsync(fileUri, content);
      
      // Utiliser expo-sharing pour permettre à l'utilisateur de choisir où sauvegarder
      if (Platform.OS === 'android') {
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(fileUri, {
            mimeType: 'application/json',
            dialogTitle: 'Sauvegarder dans UmuryangoBudget',
            UTI: 'public.json',
          });
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Save error:', error);
      return false;
    }
  };

  const shareFile = async (filePath: string) => {
    try {
      // Always use expo-sharing for Android to save to accessible location
      if (Platform.OS === 'android') {
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(filePath, {
            mimeType: 'application/json',
            dialogTitle:
              'Choisissez où sauvegarder votre fichier UmuryangoBudget',
            UTI: 'public.json',
          });

          Alert.alert(
            'Export réussi',
            `${filePath
              .split('/')
              .pop()}\n\nFichier sauvegardé dans l'emplacement choisi.\nVous pouvez maintenant le retrouver dans vos fichiers.`,
            [{ text: 'OK' }],
          );
        } else {
          throw new Error('Sharing not available');
        }
      } else {
        // iOS
        await Share.share({
          url: filePath,
          title: 'Sauvegarde UmuryangoBudget',
          message: 'Fichier de sauvegarde de vos données budgétaires',
        });

        Alert.alert('Export réussi', 'Fichier partagé avec succès.', [
          { text: 'OK' },
        ]);
      }

      console.log('File shared successfully');
    } catch (error: any) {
      if (error?.code !== 'ERR_CANCELED') {
        console.log('Share error:', error);
        Alert.alert(
          'Erreur',
          "Impossible de sauvegarder le fichier dans le stockage externe.\n\nPour avoir un dossier UmuryangoBudget comme WhatsApp, vous devez créer un build de développement au lieu d'utiliser Expo Go.",
          [{ text: 'OK' }],
        );
      } else {
        // User cancelled
        Alert.alert(
          'Export annulé',
          "Le fichier reste disponible dans l'application.",
          [{ text: 'OK' }],
        );
      }
    }
  };

  const exportData = async (): Promise<boolean> => {
    setExportLoading(true);
    try {
      // Collect all data
      const keys = await AsyncStorage.getAllKeys();
      const budgetKeys = keys.filter(
        key =>
          key.startsWith('@budget_') ||
          key.startsWith('budget_data_') ||
          key === '@budget_history',
      );

      const allData = await AsyncStorage.multiGet(budgetKeys);
      const budgetHistory = allData.find(([key]) => key === '@budget_history');
      const monthlyBudgets: { [key: string]: MonthlyBudget } = {};

      allData.forEach(([key, value]) => {
        if (key.startsWith('@budget_data_') || key.startsWith('budget_data_')) {
          if (value) {
            const monthId = key
              .replace('@budget_data_', '')
              .replace('budget_data_', '');
            monthlyBudgets[monthId] = JSON.parse(value);
          }
        }
      });

      const exportData: ExportData = {
        version: '1.0.0',
        exportDate: new Date().toISOString(),
        budgetHistory: budgetHistory?.[1]
          ? JSON.parse(budgetHistory[1])
          : { monthlyBudgets: [] },
        monthlyBudgets,
      };

      const fileName = `umuryango_budget_${new Date().toISOString().split('T')[0]}.json`;
      const content = JSON.stringify(exportData, null, 2);
      
      // Essayer de créer le dossier UmuryangoBudget
      const umuryangoBudgetDir = await createUmuryangoBudgetFolder();
      let fileUri: string;
      
      if (umuryangoBudgetDir) {
        // Sauvegarder dans le dossier UmuryangoBudget
        fileUri = umuryangoBudgetDir + fileName;
      } else {
        // Fallback vers le dossier Documents standard
        fileUri = FileSystem.documentDirectory + fileName;
      }
      
      // Écrire le fichier temporaire
      await FileSystem.writeAsStringAsync(fileUri, content);
      
      if (Platform.OS === 'android') {
        // Toujours ouvrir le sélecteur de dossier
        const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        
        if (permissions.granted) {
          const savedFileUri = await FileSystem.StorageAccessFramework.createFileAsync(
            permissions.directoryUri,
            fileName,
            'application/json'
          );
          
          await FileSystem.writeAsStringAsync(savedFileUri, content);
          
          showToast.success(
            'Export réussi',
            `Fichier ${fileName} sauvegardé`
          );
          
          Alert.alert(
            'Export réussi',
            `Fichier: ${fileName}\nSauvegardé dans le dossier choisi\n\nVous pouvez le trouver dans l'application Fichiers`,
            [{ text: 'OK' }]
          );
        } else {
          showToast.error('Erreur', 'Permission refusée');
        }
      } else {
        // Pour iOS, utiliser le partage
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Sauvegarder le fichier',
        });
      }
      
      showToast.success('Export réussi', `Fichier ${fileName} créé`);
      return true;
      
    } catch (error: any) {
      console.error('Export error:', error);
      
      if (error?.code === 'ERR_CANCELED') {
        showToast.info('Export annulé', 'Vous avez annulé la sauvegarde');
        return false;
      }
      
      Alert.alert(
        "Erreur d'export",
        `Impossible d'exporter les données:\n${
          error instanceof Error ? error.message : 'Erreur inconnue'
        }`,
        [{ text: 'OK' }]
      );
      return false;
    } finally {
      setExportLoading(false);
    }
  };

  const importData = async (): Promise<boolean> => {
    setImportLoading(true);
    try {
      // Pick file
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        setImportLoading(false);
        return false;
      }

      // Read file
      const fileContent = await FileSystem.readAsStringAsync(
        result.assets[0].uri,
      );
      const importedData: ExportData = JSON.parse(fileContent);

      // Validate data structure
      if (
        !importedData.version ||
        !importedData.budgetHistory ||
        !importedData.monthlyBudgets
      ) {
        throw new Error('Invalid file format');
      }

      // Get existing data
      const existingHistoryData = await AsyncStorage.getItem('@budget_history');
      const existingHistory: BudgetHistory = existingHistoryData
        ? JSON.parse(existingHistoryData)
        : { monthlyBudgets: [] };

      // Merge data with intelligent conflict resolution
      const mergedMonthlyBudgets = new Map<string, MonthlyBudget>();
      let conflictsResolved = 0;

      // Add existing budgets first
      existingHistory.monthlyBudgets.forEach(budget => {
        mergedMonthlyBudgets.set(budget.id, budget);
      });

      // Merge imported budgets with conflict resolution
      Object.values(importedData.monthlyBudgets).forEach(importedBudget => {
        const existingBudget = mergedMonthlyBudgets.get(importedBudget.id);

        if (existingBudget) {
          // Conflict resolution: merge days with priority to imported data
          const mergedDays = new Map();

          // Add existing days
          existingBudget.days.forEach(day => {
            mergedDays.set(day.date, day);
          });

          // Override with imported days (priority to imported)
          importedBudget.days.forEach(day => {
            const existingDay = mergedDays.get(day.date);
            if (existingDay && existingDay.validated && !day.validated) {
              // Keep validated days unless imported day is also validated
              return;
            }
            mergedDays.set(day.date, {
              ...day,
              updatedAt: new Date().toISOString(),
            });
            if (existingDay) conflictsResolved++;
          });

          // Merge contributors
          const mergedContributors = new Map();
          existingBudget.contributors.forEach(c =>
            mergedContributors.set(c.name, c),
          );
          importedBudget.contributors.forEach(c =>
            mergedContributors.set(c.name, c),
          );

          mergedMonthlyBudgets.set(importedBudget.id, {
            ...importedBudget,
            days: Array.from(mergedDays.values()),
            contributors: Array.from(mergedContributors.values()),
            updatedAt: new Date().toISOString(),
          });
        } else {
          // New budget, add directly
          mergedMonthlyBudgets.set(importedBudget.id, {
            ...importedBudget,
            updatedAt: new Date().toISOString(),
          });
        }
      });

      // Create final merged history
      const finalHistory: BudgetHistory = {
        monthlyBudgets: Array.from(mergedMonthlyBudgets.values()).sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
      };

      // Save merged data
      await AsyncStorage.setItem(
        '@budget_history',
        JSON.stringify(finalHistory),
      );

      // Save individual monthly budgets
      for (const [monthId, budget] of mergedMonthlyBudgets) {
        await AsyncStorage.setItem(
          `@budget_data_${monthId}`,
          JSON.stringify(budget),
        );
      }

      // Show import statistics
      const importedCount = Object.keys(importedData.monthlyBudgets).length;
      const totalCount = mergedMonthlyBudgets.size;

      Alert.alert(
        'Import réussi',
        `${importedCount} budgets importés\n${conflictsResolved} conflits résolus\n${totalCount} budgets au total`,
        [{ text: 'OK' }],
      );

      return true;
    } catch (error) {
      console.error('Import error:', error);

      let errorMessage = 'Erreur inconnue';
      if (error instanceof Error) {
        if (error.message.includes('Invalid file format')) {
          errorMessage =
            "Format de fichier invalide. Veuillez sélectionner un fichier d'export valide.";
        } else if (error.message.includes('JSON')) {
          errorMessage = 'Fichier corrompu ou format JSON invalide.';
        } else {
          errorMessage = error.message;
        }
      }

      Alert.alert(
        "Erreur d'import",
        `Impossible d'importer les données:\n${errorMessage}`,
        [{ text: 'OK' }],
      );

      return false;
    } finally {
      setImportLoading(false);
    }
  };

  // Fonction pour lister les fichiers d'export sauvegardés
  const listSavedExports = async (): Promise<string[]> => {
    try {
      const umuryangoBudgetDir = await createUmuryangoBudgetFolder();
      if (umuryangoBudgetDir) {
        const dirInfo = await FileSystem.getInfoAsync(umuryangoBudgetDir);
        if (dirInfo.exists && dirInfo.isDirectory) {
          const files = await FileSystem.readDirectoryAsync(umuryangoBudgetDir);
          return files.filter(file => file.endsWith('.json'));
        }
      }
      return [];
    } catch (error) {
      console.error('Error listing saved exports:', error);
      return [];
    }
  };
  
  return {
    exportLoading,
    importLoading,
    exportData,
    importData,
    listSavedExports,
    createUmuryangoBudgetFolder,
  };
};
