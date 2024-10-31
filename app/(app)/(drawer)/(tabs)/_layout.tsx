import { Redirect, Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { View, StyleSheet, Dimensions } from 'react-native';
import { setStatusBarBackgroundColor } from 'expo-status-bar';

const { width } = Dimensions.get('window'); 

export default function TabLayout() {
  const colorScheme = useColorScheme();
  

  setStatusBarBackgroundColor(Colors[colorScheme ?? 'light'].white, true);

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].greenDark,
          tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].gray,
          tabBarStyle: {
            ...styles.tabBar, 
            backgroundColor: Colors[colorScheme ?? 'light'].white,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: 'bold',
            paddingBottom: 5,
          },
          tabBarIconStyle: {
            marginTop: 5,
          },
          headerShown: false,
          
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Inicio',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Buscar',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'search' : 'search-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="my-routes"
          options={{
            title: 'Rutas',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'map' : 'map-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="calendar"
          options={{
            title: 'Calendario',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'calendar' : 'calendar-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Cuenta',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    position: 'absolute', 
    bottom: 10, 
    left: "5%", 
    width: width * 0.9, 
    borderRadius: 15,
    overflow: 'hidden',
    height: 60,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});



