import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Divider = () => {
  const color = useThemeColor({}, 'black');
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={[styles.text, {color}]}>O</Text>
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',  
    alignItems: 'center',  
    marginVertical: 10,
  },
  line: {
    flex: 1,  
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  text: {
    marginHorizontal: 10, 
    fontSize: 16,  
    fontWeight: 'bold',
  },
});

export default Divider;
