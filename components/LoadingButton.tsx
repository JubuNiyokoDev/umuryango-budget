
import React, { useState } from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import Icon from './Icon';

interface LoadingButtonProps {
  title: string;
  onPress: () => Promise<void> | void;
  style?: any;
  textStyle?: any;
  disabled?: boolean;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
}

export default function LoadingButton({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
  icon,
  variant = 'primary',
  loading: externalLoading = false
}: LoadingButtonProps) {
  const [internalLoading, setInternalLoading] = useState(false);
  const loading = externalLoading || internalLoading;
  const { theme } = useTheme();

  const handlePress = async () => {
    if (loading || disabled) return;
    
    if (!externalLoading) {
      setInternalLoading(true);
    }
    try {
      await onPress();
    } catch (error) {
      console.log('Button action error:', error);
    } finally {
      if (!externalLoading) {
        setInternalLoading(false);
      }
    }
  };

  const getButtonStyle = () => {
    const baseStyle = {
      backgroundColor: theme.primary,
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 24,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      flexDirection: 'row' as const,
      gap: 8,
      opacity: (disabled || loading) ? 0.6 : 1,
    };

    switch (variant) {
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: theme.backgroundAlt,
          borderWidth: 1,
          borderColor: theme.border,
        };
      case 'danger':
        return {
          ...baseStyle,
          backgroundColor: theme.error,
        };
      default:
        return baseStyle;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'secondary':
        return theme.text;
      default:
        return theme.backgroundAlt;
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={handlePress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <>
          {icon && <Icon name={icon as any} size={20} color={getTextColor()} />}
          <Text style={[{ color: getTextColor(), fontSize: 16, fontWeight: '600' }, textStyle]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}
