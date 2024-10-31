import { View, Text, StyleSheet, TextInput } from 'react-native';
import React, { useState, useRef } from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import BtnCustom from '@/components/BtnCustom';
import Modal from '@/components/Modal';
import useAxios from '@/hooks/useAxios';
import {  useLocalSearchParams } from 'expo-router';
import { useRouter } from 'expo-router';
import { setStatusBarBackgroundColor } from 'expo-status-bar';

export default function VerifyAccountScreen() {
  const { number } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const { post } = useAxios();
  const router = useRouter();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isModalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const inputs = useRef<(TextInput | null)[]>([]);

  const handleChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Mover al siguiente input si el texto tiene un dígito
    if (text && index < inputs.current.length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      setErrorMessage('Por favor ingresa el código completo');
      setModalVisible(true);
      return;
    }

    try {
      const res = await post('auth/verify-reset-password-code/', { code: fullCode, phone_number:number });
      if (res.status === 200) {

        router.push({
            pathname: '/reset-password/[number]',
            params: { number: Array.isArray(number) ? number[0] : number }
        });
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        setErrorMessage('Usuario no encontrado');
        setModalVisible(true);
      }

      if (error.response?.status === 403) {
        setErrorMessage('Código incorrecto');
        setModalVisible(true);
      }

        if (error.response?.status === 410) {
            setErrorMessage('Código expirado');
            setModalVisible(true);
        }

    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setErrorMessage('');
  };

  setStatusBarBackgroundColor(Colors[colorScheme ?? 'light'].greenSoft, true);

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? "light"].greenSoft }]}>
      <Text style={[styles.title, { color: Colors[colorScheme ?? "light"].greenDark }]}>
        Ingresa el código de verificación!
      </Text>
      <Text style={[styles.subText, { color: Colors[colorScheme ?? "light"].gray }]}>
        Hemos enviado un codigo de verificación a tu número de teléfono móvil +57 {number}
      </Text>
      <View style={styles.codeContainer}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.input}
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            ref={(ref) => (inputs.current[index] = ref)}
          />
        ))}
      </View>
      <BtnCustom onPress={handleSubmit} title="Verificar" />
      <Modal
        isModalVisible={isModalVisible}
        errorMessage={errorMessage}
        closeModal={closeModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: "40%",
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 30,
    textAlign: 'left',
  },
  subText: {
    fontSize: 13,
    marginBottom: 40,
    textAlign: 'left',
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    fontSize: 18,
    textAlign: 'center',
    padding: 10,
    width: 50,
    height: 50,
  },
});
