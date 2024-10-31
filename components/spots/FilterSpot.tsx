import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

type FilterListProps = {
    filters: FilterData[];
    setFilter: (location: 'all' | number) => void;
}

type FilterData = {
    id: 'all' | number;
    name: string;
}

const FilterList = ({filters, setFilter} : FilterListProps) => {
  const colorScheme = useColorScheme();
  const [selectedLocation, setSelectedLocation] = useState<'all' | number>('all');

  const handlePress = (location: 'all' | number) => {
    setSelectedLocation(location);
    setFilter(location);
  };

  

  const renderItem = ({ item, index, items }: { item: FilterData, index: any, items: FilterData[] }) => (
    <TouchableOpacity
      style={[styles.locationItem, selectedLocation === item.id && {backgroundColor: Colors[colorScheme ?? "light"].greenDark}, {
        marginLeft: index === 0 ? 20 : 0,
        marginRight: index === items.length - 1 ? 20 : 0
      }]}
      onPress={() => handlePress(item.id)}
    >
      <Text style={[styles.locationText, selectedLocation === item.id && styles.selectedText]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filters}
        horizontal
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ width: 5 }} />}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => renderItem({ item, index, items: filters })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  locationItem: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
 
  locationText: {
    fontSize: 16,
    color: '#333',
  },
  selectedText: {
    color: 'white',
  },
});

export default FilterList;
