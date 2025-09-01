# 🚀 GUIDE SIMPLE - APK LÉGER + FIREBASE

## 1. INSTALLER LES OUTILS (une seule fois)

```bash
npm install -g firebase-tools
npm install --global eas-cli
```

## 2. SE CONNECTER

```bash
eas login
firebase login
```

## 3. CONFIGURER

```bash
eas build:configure
firebase init hosting
```

## 4. MODIFIER L'URL

Dans `installer/App.tsx`, ligne 8:

```typescript
const FIREBASE_BASE_URL = 'https://VOTRE-PROJET.web.app/apks/';
```

👆 Remplacez par votre vraie URL Firebase

## 5. BUILDER ET DÉPLOYER

```bash
npm run build-deploy
```

## C'EST TOUT!

Vous aurez:

- APK léger à distribuer
- Page web de téléchargement
- APKs sur Firebase

**DONNEZ-MOI JUSTE:**

- Votre URL Firebase (étape 3)
- Si ça marche ou pas
