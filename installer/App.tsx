import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, BackHandler } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Device from 'expo-device';
import DownloadScreen from './components/DownloadScreen';

const FIREBASE_BASE_URL = 'https://umuryango-budget.web.app/apks/';

export default function InstallerApp() {
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadStatus, setDownloadStatus] = useState<'checking' | 'downloading' | 'installing' | 'error'>('checking');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    checkAndDownload();
    
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (downloadStatus === 'downloading') {
        Alert.alert(
          'Téléchargement en cours',
          'Voulez-vous vraiment annuler le téléchargement?',
          [
            { text: 'Continuer', style: 'cancel' },
            { text: 'Quitter', onPress: () => BackHandler.exitApp() }
          ]
        );
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, []);

  const getDeviceArchitecture = () => {
    const supportedAbis = Device.supportedCpuArchitectures || [];
    
    if (supportedAbis.includes('arm64-v8a')) return 'arm64-v8a';
    if (supportedAbis.includes('armeabi-v7a')) return 'armeabi-v7a';
    if (supportedAbis.includes('x86_64')) return 'x86_64';
    if (supportedAbis.includes('x86')) return 'x86';
    
    return 'universal';
  };

  const checkAndDownload = async () => {
    try {
      setDownloadStatus('checking');
      
      const architecture = getDeviceArchitecture();
      const apkFileName = `umuryango-budget-${architecture}.apk`;
      const downloadUrl = `${FIREBASE_BASE_URL}${apkFileName}`;
      
      const localUri = `${FileSystem.documentDirectory}${apkFileName}`;
      const fileInfo = await FileSystem.getInfoAsync(localUri);
      
      if (fileInfo.exists) {
        await installApk(localUri);
        return;
      }

      await downloadApk(downloadUrl, localUri);
      
    } catch (error) {
      setDownloadStatus('error');
      setErrorMessage('Erreur de connexion. Vérifiez votre internet.');
    }
  };

  const downloadApk = async (url: string, localUri: string) => {
    setDownloadStatus('downloading');
    
    const downloadResumable = FileSystem.createDownloadResumable(
      url,
      localUri,
      {},
      (downloadProgress) => {
        const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
        setDownloadProgress(Math.round(progress * 100));
      }
    );

    try {
      const result = await downloadResumable.downloadAsync();
      if (result) {
        await installApk(result.uri);
      }
    } catch (error) {
      setDownloadStatus('error');
      setErrorMessage('Échec du téléchargement. Réessayez.');
    }
  };

  const installApk = async (uri: string) => {
    try {
      setDownloadStatus('installing');
      
      const contentUri = await FileSystem.getContentUriAsync(uri);
      
      await IntentLauncher.startActivityAsync('android.intent.action.INSTALL_PACKAGE', {
        data: contentUri,
        flags: 1,
      });
      
    } catch (error) {
      setDownloadStatus('error');
      setErrorMessage('Impossible d\'installer l\'application.');
    }
  };

  const retry = () => {
    setDownloadProgress(0);
    setErrorMessage('');
    checkAndDownload();
  };

  return (
    <LinearGradient
      colors={['#1976D2', '#42A5F5']}
      style={styles.container}
    >
      <DownloadScreen
        status={downloadStatus}
        progress={downloadProgress}
        errorMessage={errorMessage}
        onRetry={retry}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});