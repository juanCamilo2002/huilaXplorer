import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

type StarRatingListProps = {
  name : string;
  setRating: any;
  filter: any;
};

const StarRatingList = ({name, setRating, filter} : StarRatingListProps) => {
  const [selectedRating, setSelectedRating] = useState<number | null>(filter[name] ?? null);
  const colorScheme = useColorScheme();

  useEffect(()=>{
    setSelectedRating(filter[name] ?? null);
  }, [filter, name]);

  // Función para manejar la selección de la calificación
  const handleSelectRating = (rating: number) => {
    setSelectedRating(rating === selectedRating ? null : rating);
    setRating({ ...filter, [name]: rating });
  };

  // Renderiza una fila de estrellas con un checkbox personalizado
  const renderStarRow = (rating: number) => (
    <TouchableOpacity style={styles.row} onPress={() => handleSelectRating(rating)} key={rating}>
      <View style={styles.starContainer}>
        {[...Array(rating)].map((_, index) => (
          <Ionicons key={index} name="star" size={24} color="#FFD700" />
        ))}
        {[...Array(5 - rating)].map((_, index) => (
          <Ionicons key={index} name="star-outline" size={24} color="#E0E0E0" />
        ))}
      </View>
      <TouchableOpacity style={styles.checkbox} onPress={() => handleSelectRating(rating)}>
        <Ionicons
          name={selectedRating === rating ? 'radio-button-on-outline' : 'radio-button-off-outline'}
          size={24}
          color={selectedRating === rating ? Colors[colorScheme ?? "light"].greenDark : '#E0E0E0'}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {renderStarRow(5)}
      {renderStarRow(4)}
      {renderStarRow(3)}
      {renderStarRow(2)}
      {renderStarRow(1)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    borderColor: '#E0E0E0',
    justifyContent: 'space-between',
  },
  starContainer: {
    flexDirection: 'row',
    marginRight: 10,
  },
  ratingText: {
    fontSize: 16,
  },
  checkbox: {
    paddingLeft: 10,
  },
});

export default StarRatingList;
