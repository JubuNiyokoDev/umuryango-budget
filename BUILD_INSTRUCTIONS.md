# Instructions pour créer un dossier UmuryangoBudget comme WhatsApp

## Problème avec Expo Go
Expo Go ne peut pas créer de dossiers dans le stockage externe Android. Pour avoir un dossier "UmuryangoBudget" accessible comme WhatsApp, vous devez créer un **build de développement**.

## Solution: Build de développement

### 1. Installer EAS CLI
```bash
npm install -g @expo/eas-cli
```

### 2. Se connecter à Expo
```bash
eas login
```

### 3. Configurer le projet
```bash
eas build:configure
```

### 4. Créer le build de développement Android
```bash
eas build --platform android --profile development
```

### 5. Installer l'APK sur votre téléphone
- Téléchargez l'APK depuis le lien fourni par EAS
- Installez-le sur votre téléphone
- Lancez l'application

## Résultat
Avec le build de développement, l'application pourra:
- ✅ Créer un dossier `/storage/emulated/0/UmuryangoBudget/`
- ✅ Sauvegarder les fichiers directement dans ce dossier
- ✅ Rendre les fichiers accessibles via n'importe quel gestionnaire de fichiers
- ✅ Fonctionner exactement comme WhatsApp

## Alternative temporaire
En attendant le build, l'application utilise le partage de fichiers qui permet de sauvegarder dans Downloads, Drive, etc.