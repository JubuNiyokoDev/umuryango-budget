import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { ThemeProvider } from '../contexts/ThemeContext';
import { AppStateProvider } from '../contexts/AppStateContext';
import { TranslationProvider } from '../contexts/TranslationContext';
import { PlanningClipboardProvider } from '../contexts/PlanningClipboardContext';
import { ToastConfig } from '../components/Toast';

export default function RootLayout() {
  return (
    <AppStateProvider>
      <TranslationProvider>
        <PlanningClipboardProvider>
          <ThemeProvider>
            <SafeAreaProvider>
              <Stack screenOptions={{ headerShown: false }} />
              <Toast config={ToastConfig()} />
            </SafeAreaProvider>
          </ThemeProvider>
        </PlanningClipboardProvider>
      </TranslationProvider>
    </AppStateProvider>
  );
}