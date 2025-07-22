import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

import { Theme } from '@/constants/Theme';
import { useColorScheme } from '@/hooks/useColorScheme';

interface InputProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
}

export default function Input({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
}: InputProps) {
  const scheme = useColorScheme() ?? 'light';
  const theme = Theme[scheme];

  const dynamicStyles = StyleSheet.create({
    input: {
      width: '100%',
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      padding: 12,
      marginVertical: 8,
      fontSize: 16,
      color: theme.text,
      backgroundColor: theme.surface,
    },
  });

  return (
    <TextInput
      style={dynamicStyles.input}
      placeholder={placeholder}
      placeholderTextColor={scheme === 'light' ? '#6C6C6C' : '#8A8A8A'}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize="none"
    />
  );
}

// Removed StyleSheet static styles; now uses dynamicStyles based on theme. 