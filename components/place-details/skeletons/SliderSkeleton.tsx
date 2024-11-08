import { View, Text, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import { Skeleton } from '@rneui/base';

const screenWidth = Dimensions.get('window').width;

export default function SliderSkeleton() {
  return (
    <View style={styles.container}>
      <Skeleton animation='pulse' width={screenWidth - 40} height={300} style={{borderRadius: 10}} />
      <View style={styles.images}>
        <Skeleton animation='pulse' width={80} height={60} style={{borderRadius: 10, marginTop: 10}} />
        <Skeleton animation='pulse' width={80} height={60} style={{borderRadius: 10, marginTop: 10}} />
        <Skeleton animation='pulse' width={80} height={60} style={{borderRadius: 10, marginTop: 10}} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  images: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 10,
    gap: 10,
  }
});