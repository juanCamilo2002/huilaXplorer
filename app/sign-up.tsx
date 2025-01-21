import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, { useCallback } from 'react'
import { useSession } from '@/providers/SessionProvider'
import { Link, router, useFocusEffect } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import LoginBtnProvider from '@/components/LoginBtnProvider';
import Divider from '@/components/Divider';
import InputsField from '@/components/forms/InputsField';
import BtnCustom from '@/components/BtnCustom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { CheckBox } from '@rneui/base';
import useAxios from '@/hooks/useAxios';
import { setStatusBarBackgroundColor } from 'expo-status-bar';

const signUpSchema = Yup.object().shape({
  email: Yup.string().email('Introduce un email válido').required('El email es obligatorio'),
  first_name: Yup.string().required('El nombre es obligatorio'),
  last_name: Yup.string().required('El apellido es obligatorio'),
  phone_number: Yup.string().required('El número de teléfono es obligatorio'),
  password: Yup.string()
    .required('La contraseña es obligatoria')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  repeat_password: Yup.string()
    .oneOf([Yup.ref('password'), undefined], 'Las contraseñas deben coincidir')
    .required('Debes repetir la contraseña'),
  terms_and_conditions: Yup.boolean()
    .oneOf([true], 'Debes aceptar los términos y condiciones')
    .required('Debes aceptar los términos y condiciones'),
});


interface SignUpFormData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  repeat_password: string;
  terms_and_conditions: boolean;
}

export default function SignUp() {
  const colorScheme = useColorScheme();
  const { session } = useSession();
  const { post } = useAxios();

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<SignUpFormData>({
    resolver: yupResolver(signUpSchema)
  });

  useFocusEffect(
    useCallback(() => {
      if (session) {
        router.push('/');
      }
    }, [session])
  )

  const onSubmit = async (formData: SignUpFormData) => {
    try {
      const { data, status } = await post('users/accounts/', formData);
      if (status === 201) {
        router.push({
          pathname: '/verify-account/[number]',
          params: { number: data.phone_number }
        })
      }
    } catch (error: any) {
      console.error(error);

    }
  }

  setStatusBarBackgroundColor(Colors[colorScheme ?? 'light'].greenSoft, true);

  return (
    <ScrollView>
      <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? "light"].greenSoft }]}>
        <View style={{ height: 125 }} />
        <Text style={[styles.title, { color: Colors[colorScheme ?? "light"].greenDark }]}>Crear Cuenta</Text>
        {/* 
        <View style={styles.containerProviders}>
          <LoginBtnProvider
            onPress={() => { alert('google') }}
            image="https://www.svgrepo.com/show/303108/google-icon-logo.svg"
          />
          <LoginBtnProvider
            onPress={() => { alert('facebook') }}
            image="https://www.svgrepo.com/show/448224/facebook.svg"
          />
        </View> */}

        {/* <Divider /> */}
        <InputsField
          control={control}
          name="email"
          placeholder="Correo electrónico"
          keyBoardType='email-address'
          errors={errors}
          leftIcon='mail'
        />


        <InputsField
          control={control}
          name="first_name"
          placeholder="Nombres"
          errors={errors}
          leftIcon='person'
        />

        <InputsField
          control={control}
          name="last_name"
          placeholder="Apellidos"
          errors={errors}
          leftIcon='person'
        />

        <InputsField
          control={control}
          name="phone_number"
          placeholder="Número de teléfono"
          keyBoardType='phone-pad'
          errors={errors}
          leftIcon='call'
        />


        <InputsField
          control={control}
          name="password"
          placeholder="Introduce tu contraseña"
          secureTextEntry={true}
          errors={errors}
          leftIcon='lock-closed'
        />
        <InputsField
          control={control}
          name="repeat_password"
          placeholder="Repite tu contraseña"
          secureTextEntry={true}
          errors={errors}
          leftIcon='lock-closed'
        />

        <CheckBox
          title="Acepto los términos y condiciones"
          checked={watch('terms_and_conditions')}
          onPress={() => setValue('terms_and_conditions', !watch('terms_and_conditions'))}
          containerStyle={styles.checkboxContainer}
          checkedColor="green"
          uncheckedColor="gray"
          checkedIcon={
            <View style={styles.checkedBox}>
              <Text style={styles.checkmark}>✓</Text>
            </View>
          }
          uncheckedIcon={
            <View style={styles.uncheckedBox} />
          }
        />
        {errors.terms_and_conditions && (
          <Text style={{ color: 'red' }}>{errors.terms_and_conditions.message}</Text>
        )}


        <BtnCustom onPress={handleSubmit(onSubmit)} title='Crear Cuenta ' />

        <View style={styles.textSignUp}>
          <Text style={{ color: Colors[colorScheme ?? 'light'].black }}>¿Ya tienes una cuenta? </Text>
          <Link href="/sign-in" style={[{ color: Colors[colorScheme ?? "light"].greenDark }, styles.register]}>Inicia sesión</Link>
        </View>
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  containerProviders: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 20,
    gap: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: 'medium',
    marginBottom: 20,
    textAlign: 'left',
    fontFamily: 'Poppins-Medium',
  },
  forgotPassword: {
    textAlign: 'right',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  textSignUp: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  register: {
    fontWeight: 'bold',
  },
  checkboxContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    marginLeft: 0,
  },
  checkedBox: {
    width: 24,
    height: 24,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  uncheckedBox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: 'gray',
    borderRadius: 8,
  },
  checkmark: {
    color: 'white',
    fontWeight: 'bold',
  },

});

