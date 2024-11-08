import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { useSession } from '@/providers/SessionProvider';
import { Button } from '@rneui/base';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const { signOut, userProfile } = useSession();
  console.log(userProfile);
  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? "light"].white}]}>
      <Text>ProfileScreen</Text>
      <Button title="Sign Out" onPress={signOut} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});