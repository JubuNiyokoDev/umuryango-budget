import React, { useState, useEffect } from 'react';
import { View, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import your app screens
import HomeScreen from './app/home';
import BudgetScreen from './app/budget';
import HistoryScreen from './app/history';
import SettingsScreen from './app/settings';
import DayDetailsScreen from './app/day-details-simple';
import BottomNavigation from './components/BottomNavigation';

type Screen = 'home' | 'budget' | 'history' | 'settings' | 'day-details';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen onNavigateToDayDetails={(date) => {
          setSelectedDate(date);
          setCurrentScreen('day-details');
        }} />;
      case 'budget':
        return <BudgetScreen />;
      case 'history':
        return <HistoryScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'day-details':
        return <DayDetailsScreen 
          selectedDate={selectedDate} 
          onBack={() => setCurrentScreen('home')}
        />;
      default:
        return <HomeScreen onNavigateToDayDetails={(date) => {
          setSelectedDate(date);
          setCurrentScreen('day-details');
        }} />;
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={{ flex: 1 }}>
        {renderScreen()}
        {currentScreen !== 'day-details' && (
          <BottomNavigation 
            currentTab={currentScreen}
            onTabPress={(tab) => setCurrentScreen(tab as Screen)}
          />
        )}
      </View>
    </SafeAreaProvider>
  );
}

export default App;
