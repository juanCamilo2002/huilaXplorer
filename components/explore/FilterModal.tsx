import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import FilterList from './FilterList';
import StarRatingList from './StarRatingList';
import useAxios from '@/hooks/useAxios';
import { useFocusEffect } from 'expo-router';

const { width } = Dimensions.get('window');

type FilterModalProps = {
    isVisible: boolean;
    onClose: () => void;
    setFilters?: any;
    filters?: any;
}

const FilterModal = ({ isVisible, onClose, setFilters, filters }: FilterModalProps) => {
  const colorScheme = useColorScheme();
  const translateX = useSharedValue(width);
  const [locations, setLocations] = useState([]);
  const [activities, setActivities] = useState([]);
  const [filtersSelected, setFiltersSelected] = useState(filters);
  const { get } = useAxios();

  const fetchLocations = async () => {
    try {
      const { data } = await get('/location-spots/');
      setLocations(data.results);
    } catch (error) {
      console.error(error);
    }
  }

  const fetchActivities = async () => {
    try {
      const { data } = await get('/activities-spots/');
      setActivities(data.results);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    translateX.value = isVisible ? withTiming(0, { duration: 300 }) : withTiming(width, { duration: 300 });
  }, [isVisible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  useFocusEffect(
    useCallback(() => {
      fetchLocations();
      fetchActivities();
    }, [])
  )
  
  const handleApplyFilters = () => {
    setFilters(filtersSelected);
    onClose();
  }

  const handleClearFilters = () => {
    setFilters({});
    setFiltersSelected({});
    onClose();
  }

  return (
    <Modal
      visible={isVisible}
      animationType="none" // Desactiva la animación predeterminada
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.modalContent, animatedStyle, { backgroundColor: Colors[colorScheme ?? "light"].white }]}>
          <View style={styles.header}>
            <TouchableOpacity style={[styles.backButton, {borderColor: Colors[colorScheme ?? "light"].greenLight}]} onPress={onClose}>
                    <Ionicons name='arrow-back' size={20} />
            </TouchableOpacity>
            <Text style={styles.title}>Filtros</Text>
          </View>

          
          <ScrollView style={{paddingTop: 20}}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>Ubicación</Text>
            <FilterList filters={locations} name='location' setFilter={setFiltersSelected} filter={filtersSelected}/>    

            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>Reseñas</Text>
            <StarRatingList name="average_rating"  setRating={setFiltersSelected} filter={filtersSelected} />
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>Tipo de lugar</Text>
            <FilterList filters={activities} name='activity' setFilter={setFiltersSelected} filter={filtersSelected}/>    
          </ScrollView>

          {/* Aquí van los filtros y botones */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleClearFilters} style={[styles.button, {backgroundColor: Colors[colorScheme ?? "light"].greenLight}]}>
              <Text style={{color: Colors[colorScheme ?? "light"].black, fontWeight: "bold"}}>Limpiar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleApplyFilters} style={[styles.button, {backgroundColor: Colors[colorScheme ?? "light"].greenDark}]}>
              <Text style={styles.buttonText} >Aplicar</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'flex-end', // Mueve el modal hacia la derecha de la pantalla
  },
  modalContent: {
    width: '80%',
    height: '100%',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  backButton: {
    padding: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  chipContainer: {
    marginBottom: 20,
  },
  chip: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
  },
  chipText: {
    fontSize: 14,
    color: 'black',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    
  },
  button: {
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default FilterModal;
