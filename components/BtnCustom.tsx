import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

interface BtnCustomProps {
  onPress: () => void;
  disabled?: boolean;
  title: string;
}

export default function BtnCustom({ onPress, disabled, title }: BtnCustomProps) {
  const backgroundColor = useThemeColor({}, 'greenDark');
  const disabledBackgroundColor = '#cccccc'; 
  const textColor = disabled ? '#666666' : '#FFFFFF'; 

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: disabled ? disabledBackgroundColor : backgroundColor }]}
      onPress={disabled ? undefined : onPress} 
      disabled={disabled}
    >
      <Text style={[styles.buttonText, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    paddingVertical: 17,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginVertical: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
