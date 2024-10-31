import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Header from '@/components/layout/Header'
import { Colors } from '@/constants/Colors';
import { FAB } from '@rneui/base';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function RoutesTab() {
  const colorScheme = useColorScheme();
  return (
    <View style={styles.container}>
      <Header/>
      <Text>RoutesTab</Text>
      <FAB
        title="Agregar"
        upperCase
        icon={{ name: 'add', color: 'white' }}
        style={styles.fab}
        color={Colors[colorScheme ?? 'light'].greenDark}
        onPress={() => console.log('FAB clicked')}
      />
      
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 80,
  },
});