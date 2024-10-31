import { View, Text, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { useColorScheme } from '@/hooks/useColorScheme';
import * as  Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import InputsField from '@/components/forms/InputsField';
import BtnCustom from '@/components/BtnCustom';
import { Colors } from '@/constants/Colors';
import useAxios from '@/hooks/useAxios';
import Modal from '@/components/Modal';
import { router } from 'expo-router';
import { setStatusBarBackgroundColor } from 'expo-status-bar';

interface SendForgotPasswordCodeFormData {
  phone_number: string;
}

const sendForgotPasswordCodeSchema = Yup.object().shape({
  phone_number: Yup
    .string()
    .required('El número de teléfono es obligatorio')
    .min(10, 'El número de teléfono debe tener al menos 10 dígitos')
});

export default function ForgotPasswordScreen() {
  const { post } = useAxios();
  const colorScheme = useColorScheme();

  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const { control, handleSubmit, formState: { errors } } = useForm<SendForgotPasswordCodeFormData>({
    resolver: yupResolver(sendForgotPasswordCodeSchema),
  });

  const onSubmit = async (formData: SendForgotPasswordCodeFormData) => {
    try {
      const { data, status } = await post('/auth/send-reset-password-code/' , formData);
      if (status === 200) {
        router.push({
          pathname: '/reset-password/verify-code/[number]',
          params: { number: formData.phone_number }
        });
      }
    } catch (error : any) {
      if (error.response?.status === 404) {
        setModalVisible(true);
        setErrorMessage('El número de teléfono no está registrado');
      }
    }
  }

  const closeModal = () => {
    setModalVisible(false);
    setErrorMessage('');
  }

  setStatusBarBackgroundColor(Colors[colorScheme ?? 'light'].greenSoft, true);
  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? "light"].greenSoft }]}>
      <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].greenDark }]}>
        ¿Olvidaste tu contraseña?
      </Text>
      <Text style={[styles.subText, { color: Colors[colorScheme ?? "light"].gray}]}>
        Ingresa tu número de teléfono para enviar el código de verificación
      </Text>
      <InputsField
        control={control}
        name="phone_number"
        placeholder="Número de teléfono"
        keyBoardType="phone-pad"
        leftIcon='call'
        errors={errors}
      />
      <BtnCustom
        title="Enviar código"
        onPress={handleSubmit(onSubmit)}
      />
      <Modal 
        isModalVisible={isModalVisible}
        closeModal={closeModal}
        errorMessage={errorMessage}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: "40%"
  },
  title: {
    fontSize: 24,
    fontWeight: 'medium',
    marginBottom: 20,
    fontFamily: 'Poppins-Medium'
  },
  subText: {
    fontSize: 13,
    marginBottom: 40

  }
})