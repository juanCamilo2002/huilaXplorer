import { View, Text } from 'react-native'
import React from 'react'
import SliderSkeleton from './SliderSkeleton'
import SpotAboutSkeleton from './SpotAboutSkeleton'

export default function PlaceDetailsSkeleton() {
  return (
    <View>
        <SliderSkeleton />
        <SpotAboutSkeleton />
    </View>
  )
}