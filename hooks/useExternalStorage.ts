import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

export const useExternalStorage = () => {
  
  const createUmuryangoBudgetFolder = async (): Promise<string | null> => {
    if (Platform.OS !== 'android') return null;
    
    try {
      // Request permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') return null;
      
      // Try to create in external storage like WhatsApp
      const externalPath = `${FileSystem.documentDirectory}../../../storage/emulated/0/UmuryangoBudget/`;
      await FileSystem.makeDirectoryAsync(externalPath, { intermediates: true });
      
      // Verify directory exists
      const dirInfo = await FileSystem.getInfoAsync(externalPath);
      if (dirInfo.exists) {
        console.log('✅ UmuryangoBudget folder created like WhatsApp');
        return externalPath;
      }
      
      return null;
    } catch (error) {
      console.log('⚠️ Could not create external folder:', error);
      return null;
    }
  };
  
  const saveToUmuryangoBudgetFolder = async (fileName: string, content: string): Promise<boolean> => {
    const folderPath = await createUmuryangoBudgetFolder();
    
    if (folderPath) {
      try {
        const filePath = `${folderPath}${fileName}`;
        await FileSystem.writeAsStringAsync(filePath, content);
        
        // Also add to media library for visibility
        const asset = await MediaLibrary.createAssetAsync(filePath);
        let album = await MediaLibrary.getAlbumAsync('UmuryangoBudget');
        
        if (!album) {
          album = await MediaLibrary.createAlbumAsync('UmuryangoBudget', asset, false);
        } else {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        }
        
        console.log('✅ File saved to UmuryangoBudget folder and gallery');
        return true;
      } catch (error) {
        console.log('❌ Failed to save to UmuryangoBudget folder:', error);
        return false;
      }
    }
    
    return false;
  };
  
  return {
    createUmuryangoBudgetFolder,
    saveToUmuryangoBudgetFolder
  };
};