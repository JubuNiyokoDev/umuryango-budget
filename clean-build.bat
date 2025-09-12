@echo off
echo Nettoyage et reconstruction du projet...

echo 1. Nettoyage des caches...
rmdir /s /q node_modules 2>nul
rmdir /s /q android\.gradle 2>nul
rmdir /s /q android\app\.cxx 2>nul
rmdir /s /q android\app\build 2>nul

echo 2. Installation des dependances...
npm install

echo 3. Nettoyage Gradle...
cd android
gradlew clean
cd ..

echo 4. Reconstruction...
cd android
gradlew assembleDebug
cd ..

echo Terminé!
pause