import { useForm } from 'react-hook-form';
import { View, Text, StyleSheet } from 'react-native';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import InputsField from '@/components/forms/InputsField';
import { useSession } from '@/providers/SessionProvider';
import { Link, router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import BtnCustom from '@/components/BtnCustom';
import LoginBtnProvider from '@/components/LoginBtnProvider';
import Divider from '@/components/Divider';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import Modal from '@/components/Modal';
import { setStatusBarBackgroundColor } from 'expo-status-bar';

const loginSchema = Yup.object().shape({
  email: Yup.string().email('Introduce un email válido').required('El email es obligatorio'),
  password: Yup.string().required('La contraseña es obligatoria'),
});

interface LoginFormData {
  email: string;
  password: string;
}

export default function SignIn() {

  const colorScheme = useColorScheme();
  const { signIn, error, isLoading, session, userProfile } = useSession();
  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema)
  });
  const [isModalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const onSubmit = async (data: LoginFormData) => {
    try {
      await signIn(data.email, data.password);
    } catch (error: any) {
      if (error.response?.status === 403) {
        return router.push('/send-verification-code');
      }
      console.error(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (session) {
        router.replace('/');
      }
    }, [session])
  )

  useEffect(() => {
    if (error) {
      setErrorMessage(error || 'Error desconocido');
      setModalVisible(true);
    }
  }, [error]);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  const closeModal = () => {
    setModalVisible(false);
  };

  setStatusBarBackgroundColor(Colors[colorScheme ?? 'light'].greenSoft, true);

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? "light"].greenSoft }]}>
      <Text style={[styles.title, { color: Colors[colorScheme ?? "light"].greenDark }]}>Iniciar sesión</Text>

      {/* <View style={styles.containerProviders}>
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
        name="password"
        placeholder="Contraseña"
        secureTextEntry={true}
        errors={errors}
        leftIcon='lock-closed'
      />
      <Link
        href="/forgot-password"
        style={[styles.forgotPassword, { color: Colors[colorScheme ?? "light"].black }]}
      >
        ¿Olvidaste tu contraseña?
      </Link>

      <BtnCustom onPress={handleSubmit(onSubmit)} title='Iniciar Sesión' />

      <View style={styles.textSignUp}>
        <Text style={{ color: Colors[colorScheme ?? "light"].black }}>¿No tienes una cuenta? </Text>
        <Link
          href="/sign-up"
          style={[{ color: Colors[colorScheme ?? "light"].greenDark }, styles.register]}
        >
          Regístrate
        </Link>
      </View>
      {/* Modal para mostrar el error */}
      <Modal
        isModalVisible={isModalVisible}
        closeModal={closeModal}
        errorMessage={errorMessage}
      />
      
    </View>
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
    marginTop: 40,
    marginBottom: 20,
    gap: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'medium',
    marginBottom: 20,
    textAlign: 'left',
    fontFamily: 'Poppins-Medium'
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
  
});
