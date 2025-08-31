import { Platform, PermissionsAndroid } from 'react-native';
import RNFS from 'react-native-fs';
import { showToast } from '../components/Toast';

export const useRealExternalStorage = () => {
  
  const requestStoragePermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;
    
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Permission de stockage',
          message: 'UmuryangoBudget a besoin d\'accéder au stockage pour sauvegarder vos fichiers',
          buttonNeutral: 'Plus tard',
          buttonNegative: 'Refuser',
          buttonPositive: 'Autoriser',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      return false;
    }
  };
  
  const createUmuryangoBudgetFolder = async (): Promise<string | null> => {
    if (Platform.OS !== 'android') return null;
    
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      showToast.error('Permission refusée', 'Impossible de créer le dossier UmuryangoBudget');
      return null;
    }
    
    try {
      // Créer le dossier comme WhatsApp
      const folderPath = `${RNFS.ExternalStorageDirectoryPath}/UmuryangoBudget`;
      
      const exists = await RNFS.exists(folderPath);
      if (!exists) {
        await RNFS.mkdir(folderPath);
        console.log('✅ Dossier UmuryangoBudget créé comme WhatsApp');
      }
      
      return folderPath;
    } catch (error) {
      showToast.error('Erreur', 'Impossible de créer le dossier UmuryangoBudget');
      return null;
    }
  };
  
  const saveToUmuryangoBudget = async (fileName: string, content: string): Promise<boolean> => {
    const folderPath = await createUmuryangoBudgetFolder();
    if (!folderPath) return false;
    
    try {
      const filePath = `${folderPath}/${fileName}`;
      await RNFS.writeFile(filePath, content, 'utf8');
      
      showToast.success(
        '✅ Fichier sauvegardé',
        `Dans UmuryangoBudget/${fileName}`
      );
      
      return true;
    } catch (error) {
      showToast.error('Erreur de sauvegarde', 'Impossible de sauvegarder le fichier');
      return false;
    }
  };
  
  return {
    createUmuryangoBudgetFolder,
    saveToUmuryangoBudget,
    requestStoragePermission
  };
};