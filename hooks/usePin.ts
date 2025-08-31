
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PIN_KEY = 'security_pin';
const FIRST_LAUNCH_KEY = 'first_launch_completed';

export const usePin = () => {
  const [hasPin, setHasPin] = useState(false);
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkPin();
  }, []);

  const checkPin = async () => {
    try {
      const pin = await AsyncStorage.getItem(PIN_KEY);
      const firstLaunch = await AsyncStorage.getItem(FIRST_LAUNCH_KEY);
      setHasPin(!!pin);
      setIsFirstLaunch(!firstLaunch);
    } catch (error) {
      console.log('Error checking PIN:', error);
    } finally {
      setLoading(false);
    }
  };

  const setPin = async (pin: string): Promise<boolean> => {
    try {
      await AsyncStorage.setItem(PIN_KEY, pin);
      await AsyncStorage.setItem(FIRST_LAUNCH_KEY, 'completed');
      setHasPin(true);
      setIsFirstLaunch(false);
      return true;
    } catch (error) {
      console.log('Error setting PIN:', error);
      return false;
    }
  };

  const verifyPin = async (pin: string): Promise<boolean> => {
    try {
      const storedPin = await AsyncStorage.getItem(PIN_KEY);
      return storedPin === pin;
    } catch (error) {
      console.log('Error verifying PIN:', error);
      return false;
    }
  };

  const removePin = async (): Promise<boolean> => {
    try {
      await AsyncStorage.removeItem(PIN_KEY);
      setHasPin(false);
      return true;
    } catch (error) {
      console.log('Error removing PIN:', error);
      return false;
    }
  };

  return { hasPin, isFirstLaunch, loading, setPin, verifyPin, removePin, checkPin };
};
