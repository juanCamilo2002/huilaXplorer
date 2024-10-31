import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import React, { useMemo, useState } from 'react';
import { Image } from 'expo-image';
import { Card } from '@rneui/base';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SpotsData } from '@/constants/SpotsType';
import { Link } from 'expo-router';

type CardSpotProps = {
  spot: SpotsData;
};

export default function CardSpot({ spot }: CardSpotProps) {
  const colorScheme = useColorScheme();
  const [addFav, setAddFav] = useState(false);

  const imagePlace = useMemo(() => {
    if (spot.images.length === 0) return '';
    const index = Math.floor(Math.random() * spot.images.length);
    return spot.images[index].image;
  }, [spot.images]);

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      let iconName: 'star-outline' | 'star' | 'star-half' = 'star-outline';
      if (i <= spot.average_rating) {
        iconName = 'star';
      } else if (i - 0.5 <= spot.average_rating) {
        iconName = 'star-half';
      }
      stars.push(
        <Ionicons
          key={i}
          name={iconName}
          size={20}
          color={Colors[colorScheme ?? 'light'].greenLight}
          style={{ marginRight: 1 }}
        />
      );
    }
    return stars;
  };

  const screenWidth = Dimensions.get('window').width;
  const cardWidth = screenWidth * 0.9; 

  return (
    <Link href={{ pathname: '/place-details/[id]', params: { id: spot.id } }} style={styles.link}>
      <Card containerStyle={[styles.card, { width: cardWidth }]}>
        <View>
          <Image
            source={{ uri: imagePlace }}
            style={{ width: 'auto', height: 200 }}
            contentFit='cover'
          />
          <TouchableOpacity
            onPress={() => setAddFav(prev => !prev)}
            style={[styles.iconContainer, { backgroundColor: Colors[colorScheme ?? 'light'].white }]}>
            <Ionicons
              name={addFav ? 'heart' : 'heart-outline'}
              size={25}
              color={Colors[colorScheme ?? 'light'].greenDark}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.body}>
          <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
            {spot.name}
          </Text>
          <Text style={styles.subtitle}>{spot.location.name}</Text>
          <View style={styles.ratingContainer}>
            <View style={styles.starsContainer}>{renderStars()}</View>
            <Text style={styles.reviews}>
              {spot.num_reviews} reseñas • {spot.average_rating} estrellas promedio
            </Text>
          </View>
        </View>
      </Card>
    </Link>
  );
}

const styles = StyleSheet.create({
  link: {
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    padding: 0,
    borderRadius: 10,
    overflow: 'hidden',
  },
  title: {
    fontSize: 20,
    marginBottom: 5,
    fontFamily: 'Poppins-Medium',
    flexShrink: 1,
  },
  subtitle: {
    color: 'gray',
    marginBottom: 5,
  },
  body: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'flex-start',
  },
  ratingContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 2,
  },
  reviews: {
    color: 'gray',
    fontSize: 11,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  iconContainer: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 10,
    right: 10,
  },
});
