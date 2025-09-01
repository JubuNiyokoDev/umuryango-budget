import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, BackHandler } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Device from 'expo-device';
import { LinearGradient } from 'expo-linear-gradient';

const GITHUB_RELEASES_URL = 'https://api.github.com/repos/JubuNiyokoDev/umuryango-budget/releases/latest';

export default function InstallerApp() {
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [status, setStatus] = useState<'ready' | 'checking' | 'downloading' | 'installing' | 'error'>('ready');
  const [errorMessage, setErrorMessage] = useState('');
  const [currentVersion, setCurrentVersion] = useState('v17');

  useEffect(() => {
    checkForUpdates();
  }, []);

  const getDeviceArchitecture = () => {
    const supportedAbis = Device.supportedCpuArchitectures || [];
    
    if (supportedAbis.includes('arm64-v8a')) return 'arm64-v8a';
    if (supportedAbis.includes('armeabi-v7a')) return 'armeabi-v7a';
    if (supportedAbis.includes('x86_64')) return 'x86_64';
    if (supportedAbis.includes('x86')) return 'x86';
    
    return 'universal';
  };

  const checkForUpdates = async () => {
    try {
      setStatus('checking');
      const response = await fetch(GITHUB_RELEASES_URL);
      const release = await response.json();
      
      if (release.tag_name !== currentVersion) {
        setCurrentVersion(release.tag_name);
      }
      
      setStatus('ready');
    } catch (error) {
      setStatus('ready');
    }
  };

  const downloadAndInstall = async () => {
    try {
      setStatus('downloading');
      setDownloadProgress(0);
      
      const architecture = getDeviceArchitecture();
      const apkFileName = `app-${architecture}-release.apk`;
      const downloadUrl = `https://github.com/JubuNiyokoDev/umuryango-budget/releases/download/${currentVersion}/${apkFileName}`;
      
      const localUri = `${FileSystem.documentDirectory}${apkFileName}`;
      
      const fileInfo = await FileSystem.getInfoAsync(localUri);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(localUri);
      }

      const downloadResumable = FileSystem.createDownloadResumable(
        downloadUrl,
        localUri,
        {},
        (downloadProgress) => {
          const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
          setDownloadProgress(Math.round(progress * 100));
        }
      );

      const result = await downloadResumable.downloadAsync();
      if (result) {
        await installApk(result.uri);
      }
      
    } catch (error) {
      setStatus('error');
      setErrorMessage('Erreur de téléchargement. Vérifiez votre connexion.');
    }
  };

  const installApk = async (uri: string) => {
    try {
      setStatus('installing');
      
      const contentUri = await FileSystem.getContentUriAsync(uri);
      
      await IntentLauncher.startActivityAsync('android.intent.action.INSTALL_PACKAGE', {
        data: contentUri,
        flags: 1,
      });
      
      BackHandler.exitApp();
      
    } catch (error) {
      setStatus('error');
      setErrorMessage('Impossible d\'installer l\'application.');
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'ready': return 'Prêt à installer';
      case 'checking': return 'Vérification des mises à jour...';
      case 'downloading': return `Téléchargement... ${downloadProgress}%`;
      case 'installing': return 'Installation en cours...';
      case 'error': return 'Erreur';
      default: return '';
    }
  };

  const retry = () => {
    setStatus('ready');
    setDownloadProgress(0);
    setErrorMessage('');
  };

  return (
    <LinearGradient colors={['#1976D2', '#42A5F5']} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>UB</Text>
          </View>
          <Text style={styles.appName}>Umuryango Budget</Text>
          <Text style={styles.appSubtitle}>Gestionnaire de budget familial</Text>
          <Text style={styles.version}>{currentVersion}</Text>
        </View>

        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>{getStatusText()}</Text>
          
          {status === 'downloading' && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${downloadProgress}%` }]} />
              </View>
            </View>
          )}

          {status === 'error' && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errorMessage}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={retry}>
                <Text style={styles.retryText}>Réessayer</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {status === 'ready' && (
          <TouchableOpacity style={styles.downloadButton} onPress={downloadAndInstall}>
            <Text style={styles.downloadButtonText}>📥 Télécharger & Installer</Text>
          </TouchableOpacity>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Architecture: {getDeviceArchitecture()}</Text>
          <Text style={styles.footerText}>Développé par Jubu Niyoko Dev</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'space-between', padding: 30 },
  logoContainer: { alignItems: 'center', marginTop: 60 },
  logoCircle: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 20, borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)'
  },
  logoText: { fontSize: 36, fontWeight: 'bold', color: '#fff' },
  appName: { fontSize: 28, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  appSubtitle: { fontSize: 16, color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginTop: 8 },
  version: { fontSize: 14, color: 'rgba(255,255,255,0.6)', marginTop: 4 },
  statusContainer: { alignItems: 'center', flex: 1, justifyContent: 'center' },
  statusText: { fontSize: 18, color: '#fff', textAlign: 'center', fontWeight: '500' },
  progressContainer: { width: '100%', marginTop: 20 },
  progressBar: {
    width: '100%', height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4, overflow: 'hidden'
  },
  progressFill: { height: '100%', backgroundColor: '#fff', borderRadius: 4 },
  errorContainer: { alignItems: 'center', marginTop: 20 },
  errorText: { fontSize: 16, color: '#ff4444', textAlign: 'center', marginBottom: 20 },
  retryButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20, paddingVertical: 12,
    borderRadius: 25, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)'
  },
  retryText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  downloadButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 16, paddingHorizontal: 32,
    borderRadius: 25, borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center'
  },
  downloadButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  footer: { alignItems: 'center' },
  footerText: { fontSize: 12, color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginVertical: 2 }
});