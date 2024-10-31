import { View, Text } from 'react-native'
import React, { useCallback, useState } from 'react'
import { useSession } from '@/providers/SessionProvider';
import useAxios from '@/hooks/useAxios';
import { SpotsData } from '@/constants/SpotsType';
import { useFocusEffect } from 'expo-router';
import SpotList from '../spots/SpotList';

export default function RecomendSpots() {
  const { session } = useSession();
  const { get } = useAxios();
  const [spots, setSpots] = useState<SpotsData[]>([]);
  const [loadingSpots, setLoadingSpots] = useState(true);
  
  const fetchSposts = async () => {
    setLoadingSpots(true);
    try {
      const { data } = await get('/tourist-spots/recommended/?location_id=all&activity_id=all', {
        headers: {
          Authorization: `Bearer ${session}`
        }
      });
      const spots = data.results;
      setSpots(spots);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingSpots(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchSposts();
    }, [])
  );
  return (
    <View>
      <SpotList spots={spots} title="Lugares recomendados" loadingSpots={loadingSpots} />
    </View>
  )
}