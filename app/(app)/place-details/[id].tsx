import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

export default function PlaceDetailes() {
  const { id } = useLocalSearchParams();
  return (
    <View>
      <Text>PlaceDetailes {id}</Text>
    </View>
  )
}