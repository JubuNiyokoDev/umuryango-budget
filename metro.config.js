const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Résoudre les conflits de dépendances
config.resolver.platforms = ['native', 'android', 'ios', 'web'];

module.exports = config;