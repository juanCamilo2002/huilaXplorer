import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import React, { useMemo } from 'react';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Iconos de estrellas
import { SpotsData } from '@/constants/SpotsType';

type CardSpotProps = {
  item: SpotsData;
  style?: object;
}


export default function CardSpot({ item, style }: CardSpotProps) {
  const { id, name, images, location, average_rating } = item;

  // Selecciona una imagen de forma aleatoria
  const imagePlace = useMemo(() => {
    if (images.length === 0) return '';
    const index = Math.floor(Math.random() * images.length);
    return images[index].image;
  }, [images]);

  // Renderiza las estrellas según el rating
  const renderStars = useMemo(() => {
    const totalStars = 5;
    const fullStars = Math.floor(average_rating);
    const halfStar = average_rating % 1 !== 0;
    const stars = [];

    for (let i = 1; i <= totalStars; i++) {
      if (i <= fullStars) {
        // Estrella llena
        stars.push(
          <Ionicons key={i} name="star" size={30} color="white" style={{ marginRight: 2 }} />
        );
      } else if (halfStar && i === fullStars + 1) {
        // Estrella a medias
        stars.push(
          <Ionicons key={i} name="star-half" size={30} color="white" style={{ marginRight: 2 }} />
        );
      } else {
        // Estrella vacía
        stars.push(
          <Ionicons key={i} name="star-outline" size={30} color="white" style={{ marginRight: 2 }} />
        );
      }
    }
    return stars;
  }, [average_rating]);

  return (
    <Link href={{ pathname: '/place-details/[id]', params: { id } }}>
      <View style={[styles.container, style]}>
        <ImageBackground
          source={{ uri: imagePlace }}
          style={styles.image}
          borderRadius={8}
        >
          <View style={styles.ratingContainer}>
            {renderStars}
          </View>
          <View>
            <Text style={[styles.text, { fontSize: 25 }]}>{name}</Text>
            <Text style={[styles.text, { fontSize: 20 }]}>{location.name}</Text>
          </View>
        </ImageBackground>
      </View>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 330,
    height: 210,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'space-between',
    padding: 20,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
