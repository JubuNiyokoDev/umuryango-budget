import React, { useEffect, useState } from 'react';
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

type Screen = 'home' | 'budget' | 'history' | 'settings' | 'day-details';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const { initialize } = useStartIO();
  const { showAppOpenAd } = useAppOpenAd();

  useEffect(() => {
    // Initialise AdMob avec protection
    try {
      mobileAds().initialize();
    } catch (error) {
      console.log('AdMob initialization failed:', error);
    }
    
    // Initialise Start.io avec protection
    try {
      initialize();
    } catch (error) {
      console.log('Start.io initialization failed:', error);
    }
    
    // Show App Open Ad avec protection
    try {
      setTimeout(() => showAppOpenAd(), 2000);
    } catch (error) {
      console.log('App Open Ad failed:', error);
    }
    
    // SplashScreen désactivé pour éviter les blocages
    console.log('App ready - splash should hide automatically');
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
