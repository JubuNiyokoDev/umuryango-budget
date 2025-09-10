import * as React from 'react';
import { useEffect, useState } from 'react';
import { View, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import mobileAds from 'react-native-google-mobile-ads';
import { useStartIO } from './hooks/useStartIO';
import { useAppOpenAd } from './hooks/useAppOpenAd';

import HomeScreen from './app/home';
import BudgetScreen from './app/budget';
import HistoryScreen from './app/history';
import SettingsScreen from './app/settings';
import DayDetailsScreen from './app/day-details-simple';
import BottomNavigation from './components/BottomNavigation';
import UpdateManager from './UpdateManager';
import { PlanningClipboardProvider } from './contexts/PlanningClipboardContext';
import { SplashScreen } from 'expo-router';

type Screen = 'home' | 'budget' | 'history' | 'settings' | 'day-details';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const { initialize } = useStartIO();
  const { showAppOpenAd } = useAppOpenAd();

  useEffect(() => {
    // Initialise AdMob
    mobileAds().initialize();
    
    // Initialise Start.io
    initialize();
    
    // Show App Open Ad
    setTimeout(() => showAppOpenAd(), 2000);
    
    // Masque le splash natif une fois l'app prête
    SplashScreen.hide();
  }, []);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen />;
      case 'budget':
        return <BudgetScreen />;
      case 'history':
        return <HistoryScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'day-details':
        return (
          <DayDetailsScreen
            selectedDate={selectedDate}
            onBack={() => setCurrentScreen('home')}
          />
        );
      default:
        return <HomeScreen />;
    }
  };

  return (
    <SafeAreaProvider>
      <PlanningClipboardProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <View style={{ flex: 1 }}>
          {renderScreen()}
          {currentScreen !== 'day-details' && (
            <BottomNavigation
              currentTab={currentScreen}
              onTabPress={tab => setCurrentScreen(tab as Screen)}
            />
          )}
          <UpdateManager />
        </View>
      </PlanningClipboardProvider>
    </SafeAreaProvider>
  );
}
