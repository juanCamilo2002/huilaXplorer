import Header from '@/components/layout/Header';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ScrollView, StyleSheet, View, } from 'react-native';
import CloseSpots from '@/components/home/CloseSpots';
import RecomendSpots from '@/components/home/RecomendSpots';
import ActivitySpots from '@/components/home/ActivitySpots';



export default function HomeScreen() {
  const colorScheme = useColorScheme();
  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? "light"].white }]}>
      <Header />
      <ScrollView style={styles.scroll}>
        <RecomendSpots/>
        <CloseSpots />
        <ActivitySpots />
      </ScrollView>
     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
    paddingTop: 20,
  }
});
