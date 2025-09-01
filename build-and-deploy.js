const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const BUILDS = {
  arm64: 'arm64',
  arm32: 'arm32',
  x86: 'x86',
  universal: 'universal',
};
const DIST_DIR = './dist';
const APKS_DIR = './dist/apks';

console.log('🚀 Début du processus de build et deploy...');

// Créer les dossiers
if (!fs.existsSync(DIST_DIR)) {
  fs.mkdirSync(DIST_DIR, { recursive: true });
}
if (!fs.existsSync(APKS_DIR)) {
  fs.mkdirSync(APKS_DIR, { recursive: true });
}

// Étape 1: Build l'app principale pour chaque architecture
console.log('📱 Build des APKs par architecture...');

Object.entries(BUILDS).forEach(([name, profile]) => {
  console.log(`Building for ${name}...`);

  try {
    // Build l'APK avec EAS cloud
    execSync(
      `eas build --platform android --profile ${profile} --non-interactive`,
      {
        stdio: 'inherit',
      },
    );

    console.log(`✅ APK ${name} créé`);
  } catch (error) {
    console.error(`❌ Erreur lors du build ${name}:`, error.message);
  }
});

// Étape 2: Build l'installeur léger
console.log("🔧 Build de l'installeur léger...");

try {
  // Copier les fichiers de l'installeur (Windows)
  execSync('xcopy /E /I installer\\* .\\', { stdio: 'inherit' });

  // Build l'installeur
  execSync(
    'eas build --platform android --profile installer --non-interactive',
    {
      stdio: 'inherit',
    },
  );

  console.log('✅ Installeur léger créé');
} catch (error) {
  console.error("❌ Erreur lors du build de l'installeur:", error.message);
}

// Étape 3: Créer index.html pour Firebase Hosting
const indexHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Umuryango Budget - Download</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body { 
            font-family: Arial, sans-serif; 
            text-align: center; 
            padding: 50px;
            background: linear-gradient(135deg, #1976D2, #42A5F5);
            color: white;
            min-height: 100vh;
            margin: 0;
        }
        .container { max-width: 600px; margin: 0 auto; }
        .logo { font-size: 48px; margin-bottom: 20px; }
        .download-btn { 
            background: rgba(255,255,255,0.2); 
            border: 2px solid rgba(255,255,255,0.3);
            color: white; 
            padding: 15px 30px; 
            font-size: 18px; 
            border-radius: 25px;
            text-decoration: none;
            display: inline-block;
            margin: 10px;
            transition: all 0.3s;
        }
        .download-btn:hover { 
            background: rgba(255,255,255,0.3);
            transform: translateY(-2px);
        }
        .apk-list { margin-top: 40px; }
        .apk-item { margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">📱</div>
        <h1>Umuryango Budget</h1>
        <p>Gestionnaire de budget familial</p>
        
        <div class="apk-list">
            <h3>Télécharger l'application:</h3>
            ${Object.keys(BUILDS)
              .map(
                arch => `
                <div class="apk-item">
                    <a href="/apks/umuryango-budget-${arch}.apk" class="download-btn">
                        📥 ${arch.toUpperCase()}
                    </a>
                </div>
            `,
              )
              .join('')}
        </div>
        
        <p style="margin-top: 40px; opacity: 0.8;">
            Développé par Jubu Niyoko Dev
        </p>
    </div>
</body>
</html>
`;

fs.writeFileSync(`${DIST_DIR}/index.html`, indexHtml);
console.log('✅ Page de téléchargement créée');

// Étape 4: Deploy sur Firebase
console.log('🚀 Déploiement sur Firebase Hosting...');

try {
  execSync('firebase deploy --only hosting', { stdio: 'inherit' });
  console.log('✅ Déploiement terminé!');
  console.log('🌐 Votre app est disponible sur Firebase Hosting');
} catch (error) {
  console.error('❌ Erreur lors du déploiement:', error.message);
}

console.log('🎉 Processus terminé!');
