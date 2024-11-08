import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Skeleton } from '@rneui/base'

export default function CardRouteSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Skeleton height={25} width={150} />
        <Skeleton height={25} width={25} circle/>
      </View>
      <View style={styles.wrapper}>
        <Skeleton height={20} width={100}/>
        <Skeleton height={20} width={100}/>
      </View>
      <View style={styles.footer}>
        <Skeleton height={20} width={120}/>
        <Skeleton height={20} width={120}/>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 20,
    marginHorizontal: 1,
    marginVertical: 5,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    gap: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
})