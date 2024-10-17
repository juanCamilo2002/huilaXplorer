import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { setStatusBarBackgroundColor } from 'expo-status-bar';
import { SessionProvider } from '@/providers/SessionProvider';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    "Poppins-Medium": require('../assets/fonts/Poppins-Medium.ttf'),
    "Poppins-Regular": require('../assets/fonts/Poppins-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  setStatusBarBackgroundColor(colorScheme === 'dark' ? DarkTheme.colors.background : DefaultTheme.colors.background, true);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SessionProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <Stack>
            <Stack.Screen name='sign-in' options={{ headerShown: false }} />
            <Stack.Screen name='sign-up' options={{ headerShown: false }} />
            <Stack.Screen name='forgot-password' options={{ headerShown: false }} />
            <Stack.Screen name='verify-account/[number]' options={{ headerShown: false }} />
            <Stack.Screen name='reset-password/verify-code/[number]' options={{ headerShown: false }} />
            <Stack.Screen name='reset-password/[number]' options={{ headerShown: false }} />
            <Stack.Screen name='send-verification-code' options={{ headerShown: false }} />
            <Stack.Screen name='preferences' options={{ headerShown: false }} />
            <Stack.Screen name="(app)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </SafeAreaView>
      </SessionProvider>
    </ThemeProvider>
  );
}
