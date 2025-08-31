import React from 'react';
import Toast from 'react-native-toast-message';
import { useStyles } from '../styles/commonStyles';

export const showToast = {
  success: (title: string, message?: string) => {
    Toast.show({
      type: 'success',
      text1: title,
      text2: message,
      visibilityTime: 3000,
    });
  },
  
  error: (title: string, message?: string) => {
    Toast.show({
      type: 'error',
      text1: title,
      text2: message,
      visibilityTime: 4000,
    });
  },
  
  info: (title: string, message?: string) => {
    Toast.show({
      type: 'info',
      text1: title,
      text2: message,
      visibilityTime: 3000,
    });
  }
};

export const ToastConfig = () => {
  const { colors } = useStyles();
  
  return {
    success: (props: any) => (
      <Toast
        {...props}
        style={{
          backgroundColor: colors.success,
          borderLeftColor: colors.success,
        }}
        text1Style={{ color: '#fff', fontWeight: '600' }}
        text2Style={{ color: '#fff' }}
      />
    ),
    error: (props: any) => (
      <Toast
        {...props}
        style={{
          backgroundColor: colors.error,
          borderLeftColor: colors.error,
        }}
        text1Style={{ color: '#fff', fontWeight: '600' }}
        text2Style={{ color: '#fff' }}
      />
    ),
    info: (props: any) => (
      <Toast
        {...props}
        style={{
          backgroundColor: colors.primary,
          borderLeftColor: colors.primary,
        }}
        text1Style={{ color: '#fff', fontWeight: '600' }}
        text2Style={{ color: '#fff' }}
      />
    ),
  };
};