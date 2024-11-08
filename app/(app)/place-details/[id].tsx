import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, { useCallback, useState } from 'react'
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { SpotsData } from '@/constants/SpotsType';
import useAxios from '@/hooks/useAxios';
import Slider from '@/components/place-details/Slider';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import SpotAbout from '@/components/place-details/SpotAbout';
import Reviews from '@/components/place-details/Reviews';
import PlaceDetailsSkeleton from '@/components/place-details/skeletons/PlaceDetailsSkeleton';


export default function PlaceDetailes() {
  const { id } = useLocalSearchParams();
  const { get } = useAxios();
  const colorScheme = useColorScheme();

  const [place, setPlace] = useState<SpotsData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchPLace = async () => {
    setLoading(true);
    try {
      const { data } = await get(`/tourist-spots/${id}/`);
      setPlace(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(useCallback(() => {
    fetchPLace();
  }, []));


  return (
    <ScrollView style={[styles.container, { backgroundColor: Colors[colorScheme ?? "light"].white }]}>
      {!loading && place ? (
        <>
          <Slider images={place.images} rating={place.average_rating} />
          <SpotAbout spot={place} />
          <Reviews spotId={place.id} />
        </>
      )
        : <PlaceDetailsSkeleton />
      }

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20

  }
});
