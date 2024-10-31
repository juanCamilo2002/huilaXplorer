// SearchHeader.js
import { View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import React, { useState } from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import FilterModal from '../explore/FilterModal';

type InputSearchProps = {
  onSearch: (search: string) => void;
  
}

const InputSearch = ({ onSearch }: InputSearchProps) => {
  const [search, setSearch] = useState("");
  const colorScheme = useColorScheme();
  const updateSearch = (search: string) => {
    setSearch(search);
    onSearch(search);

  };

  const onCancel = () => {
    setSearch("");
    onSearch("");
  }

  return (
    <View style={styles.search}>
      <Ionicons name="search" size={20} color={Colors[colorScheme ?? "light"].gray} style={styles.searchIcon} />
      <TextInput
        style={[styles.input, { backgroundColor: Colors[colorScheme ?? "light"].ligthgray }]}
        onChangeText={updateSearch}
        value={search}
        keyboardType='web-search'
        placeholder="¿A dónde quieres ir?"
      />
      {
        search.length > 0 &&
        <TouchableOpacity style={styles.closeBtn} onPress={() => onCancel()}>
          <Ionicons name="close" size={15} color={Colors[colorScheme ?? "light"].white} />
        </TouchableOpacity>
      }
    </View>
  );
};

type SearchHeaderProps = {
  onSearch: (search: string) => void;
  setFilters?: any;
  filters?: any;
}

export default function SearchHeader({ onSearch, setFilters, filters }: SearchHeaderProps) {
  const colorScheme = useColorScheme();
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  return (
    <View style={[styles.container, {
      backgroundColor: Colors[colorScheme ?? "light"].white,
      borderBottomColor: Colors[colorScheme ?? 'light'].greenLight
    }]}>
      <View style={styles.wrapper}>
        <InputSearch onSearch={onSearch} />
        <TouchableOpacity
          style={[styles.filterBtn, { backgroundColor: Colors[colorScheme ?? "light"].greenDark }]}
          onPress={() => setIsFilterVisible(true)}
        >
          <MaterialIcons name="tune" size={30} color={Colors[colorScheme ?? "light"].white} />
        </TouchableOpacity>
      </View>

      {/* Uso del componente FilterModal */}
      <FilterModal
        isVisible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        setFilters={setFilters}
        filters={filters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 80,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  searchIcon: {
    position: 'absolute',
    left: 10,
    zIndex: 1
  },
  input: {
    borderRadius: 8,
    paddingHorizontal: 40,
    paddingVertical: 7,
    marginRight: 30,
    width: '100%',
    height: 50,
    backgroundColor: 'gray'
  },
  closeBtn: {
    marginLeft: 10,
    padding: 2,
    backgroundColor: 'gray',
    borderRadius: 1000,
    position: 'absolute',
    right: 10,
    zIndex: 1
  },
  filterBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    width: 50,
    height: 50,
    borderRadius: 8,
  },
});
