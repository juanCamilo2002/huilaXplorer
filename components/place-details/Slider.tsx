import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, FlatList } from 'react-native';
import React, { useState } from 'react';
import { SpotImageData } from '@/constants/SpotsType';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';

type SliderProps = {
  images: SpotImageData[];
  rating: number;
}

export default function Slider({ images, rating }: SliderProps) {
  const colorScheme = useColorScheme();
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  return (
    <View style={styles.container}>
      {/* Imagen principal */}
      <View style={styles.imageView}>
        <ImageBackground source={{ uri: images[currentImageIndex].image }} style={styles.image} resizeMode='cover'>
          <View style={styles.options}>
            <TouchableOpacity
              onPress={router.back}
              style={[styles.backButton, { backgroundColor: Colors[colorScheme ?? "light"].white }]}
            >
              <Ionicons name="arrow-back-outline" size={24} color="black" />
            </TouchableOpacity>
            <View style={styles.rating}>
              <Ionicons name="star" size={16} color="black" />
              <Text style={styles.ratingText}>{rating}</Text>
            </View>
          </View>
        </ImageBackground>
      </View>
      {/* Imágenes pequeñas */}
      <FlatList
        data={images}
        style={styles.images}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => setCurrentImageIndex(index)}
            style={[
              styles.littleImage,
              index === currentImageIndex && [styles.selectedImage, {borderColor: Colors[colorScheme ?? "light"].greenDark}], // Agrega este estilo si la imagen está seleccionada
            ]}
          >
            <ImageBackground source={{ uri: item.image }} style={styles.image} resizeMode='cover' />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageView: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    overflow: 'hidden',
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rating: {
    flexDirection: 'row',
    gap: 5,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 5,
  },
  ratingText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    flex: 1,
    padding: 20,
    borderRadius: 10,
  },
  backButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  images: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 10,
  },
  littleImage: {
    width: 80,
    height: 60,
    borderRadius: 10,
    overflow: 'hidden',
    marginHorizontal: 5,
  },
  selectedImage: {
    borderWidth: 2
  },
});
