
import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function DrawerLayout() {
  const colorScheme = useColorScheme();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer screenOptions={{ 
        headerShown: false, 
        drawerActiveTintColor: Colors[colorScheme ?? 'light'].greenDark,
        drawerInactiveTintColor: Colors[colorScheme ?? 'light'].gray,
        drawerActiveBackgroundColor: Colors[colorScheme ?? 'light'].greenLight,
        drawerStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].white,
        }
        }}>
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerLabel: 'Inicio',
            drawerIcon(props) {
              return <Ionicons name="home" size={24} color={props.color} />;
            },
          }}
        />
        <Drawer.Screen
          name="settings"
          options={{
            drawerLabel: 'Ajustes',
            drawerIcon(props) {
              return <Ionicons name="settings" size={24} color={props.color} />;
            },
          }}
        />

      </Drawer>
    </GestureHandlerRootView>
  );
}
