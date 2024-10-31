import { View } from 'react-native'
import React, { useState } from 'react'
import InputsField from '@/components/forms/InputsField'
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import BtnCustom from '@/components/BtnCustom';
import { StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Text } from '@rneui/base';
import useAxios from '@/hooks/useAxios';
import Modal from '@/components/Modal';
import { useRouter } from 'expo-router';
import { setStatusBarBackgroundColor } from 'expo-status-bar';

const sendVerificationCodeSchema = Yup.object().shape({
  phone_number: Yup
    .string()
    .required('El número de teléfono es obligatorio')
    .min(10, 'El número de teléfono debe tener al menos 10 dígitos')
});

interface SendVerificationCodeFormData {
  phone_number: string;
}

export default function SendVerificationCodeScreen() {
  const colorScheme = useColorScheme();
  const { post } = useAxios();
  const router = useRouter();
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(sendVerificationCodeSchema),
  });

  const [isModalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async  (data: SendVerificationCodeFormData) => {
    try {
      const response = await post('/auth/resend-verification-code/', data);
      if (response.status === 200) {
        router.push({
          pathname: '/verify-account/[number]',
          params: { number: data.phone_number }
        });
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        setErrorMessage('El número de teléfono no está registrado');
        setModalVisible(true);
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
        Verificación de número de teléfono
      </Text>
      <Text style={[styles.subText, { color: Colors[colorScheme ?? 'light'].gray }]}>
        Introduce tu número de teléfono para recibir un código de verificación
      </Text>
      <InputsField
        control={control}
        name='phone_number'
        placeholder='Número de teléfono'
        keyBoardType='phone-pad'
        leftIcon='call'
        errors={errors}
      />
      <BtnCustom onPress={handleSubmit(onSubmit)} title='Enviar' />
      <Modal
        isModalVisible={isModalVisible}
        errorMessage={errorMessage}
        closeModal={closeModal}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: "40%",
    paddingHorizontal: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'medium',
    marginBottom: 30,
    textAlign: 'left',
  },
  subText: {
    fontSize: 13,
    marginBottom: 40

  }
})