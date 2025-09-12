import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { router } from 'expo-router';
import { useStyles } from '../styles/commonStyles';
import Icon from './Icon';
import { useTranslation } from '../hooks/useTranslation';
import { TranslationKey } from '../data/translations';

interface BottomNavigationProps {
  currentTab?: string;
  onTabPress?: (tab: string) => void;
}

export default function BottomNavigation({ currentTab = 'home', onTabPress }: BottomNavigationProps) {
  const { t } = useTranslation();
  const { colors, commonStyles } = useStyles();

  const tabs: { name: TranslationKey; icon: string; route: string }[] = [
    { name: 'home', icon: 'calendar-outline', route: '/home' },
    { name: 'budget', icon: 'wallet-outline', route: '/budget' },
    { name: 'history', icon: 'time-outline', route: '/history' },
  ];

  const handleTabPress = (tab: any) => {
    // Éviter de naviguer si on est déjà sur cet onglet
    if (currentTab === tab.name) {
      return;
    }
    
    try {
      if (onTabPress) {
        onTabPress(tab.name);
      } else {
        router.push(tab.route);
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <View style={[commonStyles.bottomNav, { backgroundColor: colors.backgroundAlt, borderTopColor: colors.border }]}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.name}
          style={commonStyles.bottomNavItem}
          onPress={() => handleTabPress(tab)}
        >
          <Icon
            name={tab.icon}
            size={24}
            color={currentTab === tab.name ? colors.primary : colors.text}
          />
          <Text
            style={[
              commonStyles.textSecondary,
              {
                color: currentTab === tab.name ? colors.primary : colors.text,
                fontSize: 12,
                marginTop: 4,
              },
            ]}
          >
            {t(tab.name)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}