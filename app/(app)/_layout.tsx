import { View, Text } from 'react-native'
import React from 'react'
import { Redirect, Stack } from 'expo-router'
import { useColorScheme } from '@/hooks/useColorScheme';
import { setStatusBarBackgroundColor, setStatusBarStyle } from 'expo-status-bar';
import { Colors } from '@/constants/Colors';
import { useSession } from '@/providers/SessionProvider';

export default function AppLayout() {
  const colorScheme = useColorScheme();
  const { session, isLoading, userProfile } = useSession();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!session) {
    return <Redirect href="/sign-in" />;
  }

  if (session && userProfile && userProfile.preferred_activities.length === 0) {
    return <Redirect href="/preferences" />;
  }

  setStatusBarBackgroundColor(Colors[colorScheme ?? 'light'].white, true);
  setStatusBarStyle("dark");

  return (
    <Stack
      screenOptions={{ headerShown: false }}
    > 
      <Stack.Screen name='place-details/[id]'/>
      <Stack.Screen name='(drawer)' />
    </Stack>
  )
}