import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Device from 'expo-device';
import { LinearGradient } from 'expo-linear-gradient';

const CURRENT_VERSION = 'v23';
const GITHUB_API =
  'https://api.github.com/repos/JubuNiyokoDev/umuryango-budget/releases/latest';

interface UpdateManagerProps {
  onUpdateComplete?: () => void;
}

export default function UpdateManager({
  onUpdateComplete,
}: UpdateManagerProps) {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [updateStatus, setUpdateStatus] = useState<
    'checking' | 'downloading' | 'installing' | 'idle'
  >('idle');
  const [latestVersion, setLatestVersion] = useState('');

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
      setUpdateStatus('checking');

      const response = await fetch(GITHUB_API);
      const release = await response.json();

      if (release.tag_name && release.tag_name !== CURRENT_VERSION) {
        setLatestVersion(release.tag_name);
        setUpdateAvailable(true);
        setShowUpdateModal(true);
      }

      setUpdateStatus('idle');
    } catch (error) {
      setUpdateStatus('idle');
    }
  };

  const downloadUpdate = async () => {
    try {
      setUpdateStatus('downloading');
      setDownloadProgress(0);

      const architecture = getDeviceArchitecture();
      const apkFileName = `app-${architecture}-release.apk`;
      const downloadUrl = `https://github.com/JubuNiyokoDev/umuryango-budget/releases/download/${latestVersion}/${apkFileName}`;

      const localUri = `${FileSystem.documentDirectory}update.apk`;

      // Supprimer l'ancien fichier
      const fileInfo = await FileSystem.getInfoAsync(localUri);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(localUri);
      }

      const downloadResumable = FileSystem.createDownloadResumable(
        downloadUrl,
        localUri,
        {},
        downloadProgress => {
          const progress =
            downloadProgress.totalBytesWritten /
            downloadProgress.totalBytesExpectedToWrite;
          setDownloadProgress(Math.round(progress * 100));
        },
      );

      const result = await downloadResumable.downloadAsync();
      if (result) {
        await installUpdate(result.uri);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de télécharger la mise à jour');
      setUpdateStatus('idle');
    }
  };

  const installUpdate = async (uri: string) => {
    try {
      setUpdateStatus('installing');

      const contentUri = await FileSystem.getContentUriAsync(uri);

      // Lancer l'installation
      await IntentLauncher.startActivityAsync(
        'android.intent.action.INSTALL_PACKAGE',
        {
          data: contentUri,
          flags: 1,
        },
      );

      // L'app se fermera automatiquement après installation
      if (onUpdateComplete) {
        onUpdateComplete();
      }
    } catch (error) {
      Alert.alert('Erreur', "Impossible d'installer la mise à jour");
      setUpdateStatus('idle');
    }
  };

  const skipUpdate = () => {
    setShowUpdateModal(false);
    setUpdateAvailable(false);
  };

  if (!showUpdateModal) {
    return null;
  }

  return (
    <Modal visible={showUpdateModal} transparent animationType="fade">
      <View style={styles.overlay}>
        <LinearGradient colors={['#1976D2', '#42A5F5']} style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>UB</Text>
            </View>
            <Text style={styles.title}>Mise à jour disponible</Text>
            <Text style={styles.subtitle}>Version {latestVersion}</Text>
          </View>

          {/* Content */}
          <View style={styles.content}>
            {updateStatus === 'checking' && (
              <Text style={styles.statusText}>Vérification...</Text>
            )}

            {updateStatus === 'downloading' && (
              <View style={styles.progressContainer}>
                <Text style={styles.statusText}>
                  Téléchargement... {downloadProgress}%
                </Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${downloadProgress}%` },
                    ]}
                  />
                </View>
                <Text style={styles.archText}>
                  Architecture: {getDeviceArchitecture()}
                </Text>
              </View>
            )}

            {updateStatus === 'installing' && (
              <Text style={styles.statusText}>Installation en cours...</Text>
            )}

            {updateStatus === 'idle' && updateAvailable && (
              <View style={styles.updateInfo}>
                <Text style={styles.updateText}>
                  Une nouvelle version est disponible avec des améliorations et
                  corrections.
                </Text>
                <Text style={styles.sizeText}>
                  Taille optimisée pour votre appareil (
                  {getDeviceArchitecture()})
                </Text>
              </View>
            )}
          </View>

          {/* Actions */}
          {updateStatus === 'idle' && updateAvailable && (
            <View style={styles.actions}>
              <TouchableOpacity style={styles.skipButton} onPress={skipUpdate}>
                <Text style={styles.skipText}>Plus tard</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.updateButton}
                onPress={downloadUpdate}
              >
                <Text style={styles.updateButtonText}>📥 Mettre à jour</Text>
              </TouchableOpacity>
            </View>
          )}
        </LinearGradient>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
  },
  header: { alignItems: 'center', marginBottom: 30 },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  logoText: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.8)', marginTop: 5 },
  content: { width: '100%', alignItems: 'center', marginBottom: 30 },
  statusText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '500',
  },
  progressContainer: { width: '100%', alignItems: 'center' },
  progressBar: {
    width: '100%',
    height: 8,
    marginTop: 15,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: '#fff', borderRadius: 4 },
  archText: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 10 },
  updateInfo: { alignItems: 'center' },
  updateText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 22,
  },
  sizeText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 10,
  },
  actions: { flexDirection: 'row', width: '100%', gap: 15 },
  skipButton: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
  },
  skipText: { color: 'rgba(255,255,255,0.8)', fontSize: 16 },
  updateButton: {
    flex: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
  },
  updateButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
