import { Text, TextInput, StyleSheet, View, TouchableOpacity, KeyboardTypeOptions } from 'react-native';
import React, { useState } from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons'; 
import { IconProps } from '@expo/vector-icons/build/createIconSet';
import { useThemeColor } from '@/hooks/useThemeColor';

interface InputsFieldProps {
  control: Control<any>;
  name: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  errors?: FieldErrors;
  leftIcon?: IconProps<string>['name']; 
  keyBoardType?: KeyboardTypeOptions;
}

export default function InputsField({
    control,
    name,
    errors,
    placeholder,
    secureTextEntry = false,
    leftIcon,
    keyBoardType
  }: InputsFieldProps) {
  const [showPassword, setShowPassword] = useState(false); 

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev); 
  };

  const backgroundColor = useThemeColor({}, 'greenLight');
  const txtColor = useThemeColor({}, 'black');
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <>
          <View style={[styles.inputContainer, {backgroundColor}]}>
            {leftIcon && <View style={styles.iconContainer}>
              <Ionicons name={leftIcon as any} size={24} color={txtColor} />
            </View>}
            <TextInput
              style={[styles.input, { color: txtColor, fontWeight: 'medium' }]}
              placeholder={placeholder}
              placeholderTextColor={txtColor}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType={keyBoardType}
              secureTextEntry={secureTextEntry && !showPassword} 
            />
            {secureTextEntry && (
              <TouchableOpacity onPress={togglePasswordVisibility} style={styles.iconContainer}>
                <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color={txtColor} />
              </TouchableOpacity>
            )}
          </View>
          {errors?.[name]?.message && typeof errors[name]?.message === 'string' && (
            <Text style={styles.errorText}>{errors[name].message}</Text>
          )}
        </>
      )}
    />
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 5,
    marginVertical: 5,
  },
  input: {
    flex: 1,
    padding: 10,
    fontFamily: 'Poppins-Regular',
  },
  iconContainer: {
    paddingHorizontal: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});
