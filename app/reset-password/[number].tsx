import { View, Text, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import InputsField from '@/components/forms/InputsField';
import BtnCustom from '@/components/BtnCustom';
import useAxios from '@/hooks/useAxios';
import { router, useLocalSearchParams } from 'expo-router';
import Modal from '@/components/Modal';
import { setStatusBarBackgroundColor } from 'expo-status-bar';

interface ResetPasswordFormData {
  new_password: string;
  re_new_password: string;
}

const resetPasswordSchema = Yup.object().shape({
  new_password: Yup.string()
    .required('La contraseña es obligatoria')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .matches(/[a-z]/, 'La contraseña debe contener al menos una letra minúscula')
    .matches(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
    .matches(/\d/, 'La contraseña debe contener al menos un número')
    .matches(/[@$!%*?&#]/, 'La contraseña debe contener al menos un carácter especial (@, $, !, %, *, ?, & o #)')
  ,
  re_new_password: Yup.string()
    .oneOf([Yup.ref('new_password'), undefined], 'Las contraseñas deben coincidir')
    .required('Debes repetir la contraseña'),
});



export default function ResetPassword() {
  const { number } = useLocalSearchParams();
  const colorScheme = useColorScheme();

  const { post } = useAxios();

  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const { control, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(resetPasswordSchema)
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
        const response = await post('/auth/reset-password/', {...data, phone_number: number});
        if (response.status === 200) {
          router.push('/sign-in');
        }

    } catch (error: any) {
      if (error.response?.status === 404) {
        setErrorMessage('El número de teléfono no está registrado');
        setModalVisible(true);
      }

      if (error.response?.status === 400 ) {
        setErrorMessage('Contraseñas no coinciden');
        setModalVisible(true);
      }

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
      <Text style={[styles.title, { color: Colors[colorScheme ?? "light"].greenDark }]}>Reestablecer contraseña</Text>
      <InputsField
        control={control}
        name="new_password"
        placeholder='Nueva contraseña'
        secureTextEntry
        errors={errors}
        leftIcon='lock-closed'
      />
      <InputsField
        control={control}
        name="re_new_password"
        placeholder='Repetir contraseña'
        secureTextEntry
        errors={errors}
        leftIcon='lock-closed'
      />
      <BtnCustom
        title='Cambiar contraseña'
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
    marginBottom: 60,
    fontFamily: 'Poppins-Medium'
  }
});