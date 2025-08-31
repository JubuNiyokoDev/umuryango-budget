import React from 'react';
import { Ionicons } from '@expo/vector-icons';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
}

export default function Icon({ name, size = 24, color = '#000' }: IconProps) {
  try {
    return (
      <Ionicons 
        name={name as any} 
        size={size} 
        color={color} 
      />
    );
  } catch (error) {
    console.warn('Icon error:', error);
    return (
      <Ionicons 
        name="help-outline" 
        size={size} 
        color={color} 
      />
    );
  }
}