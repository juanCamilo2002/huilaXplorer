import { View } from 'react-native'
import React from 'react'
import ReviewCardSkeleton from './ReviewCardSkeleton'


export default function ReviewsSkeleton() {
  return (
    <View>
      <ReviewCardSkeleton/>
      <ReviewCardSkeleton/>
    </View>
  )
}