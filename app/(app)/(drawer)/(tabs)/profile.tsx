import { View, Text } from 'react-native'
import React from 'react'
import { useSession } from '@/providers/SessionProvider';
import { Button } from '@rneui/base';
import { Link } from 'expo-router';

export default function ProfileScreen() {
  
  const { signOut, userProfile } = useSession();
  console.log(userProfile);
  return (
    <View>
      <Text>ProfileScreen</Text>
      <Button title="Sign Out" onPress={signOut} />
    </View>
  )
}