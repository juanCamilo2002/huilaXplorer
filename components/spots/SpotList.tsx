import { View, Text, FlatList, StyleSheet } from 'react-native';
import CardSpot from './CardSpot';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import FilterList from './FilterSpot';
import { Skeleton } from '@rneui/base';
import { SpotsData } from '@/constants/SpotsType';

type SpotListProps = {
  spots: SpotsData[];
  title: string;
  paddingBottom?: number;
  filters?: FilterData[];
  setFilter?: (location: 'all' | number) => void;
  loadingSpots: boolean;
  loadingFilters?: boolean;
};

type FilterData = {
  id: number;
  name: string;
};

export default function SpotList({ spots, title, paddingBottom, filters, setFilter = () => { }, loadingSpots, loadingFilters  }: SpotListProps) {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.textTitle, { color: Colors[colorScheme ?? "light"].greenDark }]}>{title}</Text>
      {
        loadingFilters ? (
          <View style={[styles.skeletonContainer, {marginVertical: 5}]}>
            <Skeleton animation='pulse' width={60} height={30} style={{borderRadius: 100, marginRight: 10}}/>
            <Skeleton animation='pulse' width={60} height={30} style={{borderRadius: 100, marginRight: 10}}/>
            <Skeleton animation='pulse' width={60} height={30} style={{borderRadius: 100, marginRight: 10}}/>
          </View>
        ) : (
          filters && <FilterList filters={[{ id: 'all', name: 'Todos' }, ...filters]} setFilter={setFilter} />
        )
      }
      {loadingSpots ? (
        <View style={styles.skeletonContainer}>
          <Skeleton animation='pulse' width={315} height={210} style={{borderRadius: 8}} />
        </View >
      ) : (
        <FlatList
          data={spots}
          horizontal
          ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
          keyExtractor={(item) => item.id.toString()}
          style={{ paddingBottom }}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <CardSpot
              item={item}
              style={
                spots.length > 1
                  ? {
                    paddingLeft: index === 0 ? 20 : 0,
                    paddingRight: index === spots.length - 1 ? 20 : 0,
                  }
                  : {
                    paddingLeft: 20,
                  }
              }
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    marginHorizontal: 20,
  },
  skeletonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
});
