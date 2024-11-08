import { View, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import { Skeleton } from '@rneui/base';

const screenWidth = Dimensions.get('window').width;

export default function ReviewCardSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Skeleton animation='pulse' circle width={50} height={50} />
        <Skeleton animation='pulse' width={100} height={20} style={{ borderRadius: 10 }} />
      </View>
      <View style={styles.details}>
        <Skeleton animation='pulse' width={80} height={20} style={{ borderRadius: 10 }} />
        <Skeleton animation='pulse' width={80} height={20} style={{ borderRadius: 10 }} />
      </View>
      <Skeleton animation='pulse' width={screenWidth * 0.8} height={20} style={{ borderRadius: 10, marginTop: 10 }} />
      <Skeleton animation='pulse' width={screenWidth * 0.8} height={20} style={{ borderRadius: 10, marginTop: 10 }} />
      <Skeleton animation='pulse' width={screenWidth * 0.8} height={20} style={{ borderRadius: 10, marginTop: 10 }} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  details: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});