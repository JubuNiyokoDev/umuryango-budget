# Guide de résolution des problèmes

## Erreur: RNGoogleMobileAdsModule could not be found

### Solutions à essayer dans l'ordre :

1. **Nettoyer et reconstruire le projet**
   ```bash
   # Exécuter le script de nettoyage
   clean-build.bat
   ```

2. **Vérifier l'installation du package**
   ```bash
   npm uninstall react-native-google-mobile-ads
   npm install react-native-google-mobile-ads@^15.7.0
   ```

3. **Nettoyer manuellement**
   ```bash
   # Supprimer node_modules
   rmdir /s /q node_modules
   
   # Nettoyer Gradle
   cd android
   gradlew clean
   cd ..
   
   # Réinstaller
   npm install
   
   # Reconstruire
   cd android
   gradlew assembleDebug
   ```

4. **Vérifier la configuration Android**
   - Le fichier `android/app/build.gradle` doit contenir :
     ```gradle
     implementation 'com.google.android.gms:play-services-ads:23.0.0'
     ```
   
   - Le fichier `AndroidManifest.xml` doit contenir :
     ```xml
     <meta-data
       android:name="com.google.android.gms.ads.APPLICATION_ID"
       android:value="ca-app-pub-2300546388710165~1923776861"/>
     ```

5. **Si le problème persiste**
   - Redémarrer Metro bundler
   - Redémarrer l'émulateur/appareil
   - Vérifier que l'autolinking fonctionne avec `npx react-native config`

## Erreur: Route missing default export

### Solution :
Le fichier `app/history.tsx` a été corrigé avec un export par défaut approprié.

## Commandes utiles pour le debug

```bash
# Vérifier la configuration React Native
npx react-native config

# Lister les packages liés
npx react-native info

# Nettoyer Metro cache
npx react-native start --reset-cache

# Build debug avec logs détaillés
cd android && gradlew assembleDebug --info
```