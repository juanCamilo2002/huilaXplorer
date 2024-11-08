import { View, Text, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import { Skeleton } from '@rneui/base';

const screenWidth = Dimensions.get('window').width;

export default function SpotAboutSkeleton() {
  return (
    <View style={styles.container}>
        <View style={styles.activities}>
            <Skeleton animation='pulse' width={100} height={30} style={{borderRadius: 15}} />
            <Skeleton animation='pulse' width={100} height={30} style={{borderRadius: 15}} />
        </View>
        <Skeleton animation='pulse' width={screenWidth * 0.8} height={30} style={{borderRadius: 15, marginTop: 20}} />
        <Skeleton animation='pulse' width={100} height={20} style={{borderRadius: 10, marginTop: 10}} />

        <Skeleton animation='pulse' width={70} height={20} style={{borderRadius: 15, marginTop: 30}} />
        <Skeleton animation='pulse' width={screenWidth * 0.8} height={20} style={{borderRadius: 10, marginTop: 10}} />
        <Skeleton animation='pulse' width={screenWidth * 0.8} height={20} style={{borderRadius: 10, marginTop: 10}} />
        <Skeleton animation='pulse' width={screenWidth * 0.5} height={20} style={{borderRadius: 10, marginTop: 10}} />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    activities: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 10
    }
});