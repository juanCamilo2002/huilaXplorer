import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSession } from '@/providers/SessionProvider';
import useAxios from '@/hooks/useAxios';
import SpotList from '../spots/SpotList';
import { SpotsData } from '@/constants/SpotsType';

type Locations = {
  id: number;
  name: string;
}

export default function CloseSpots() {
  const { session } = useSession();
  const { get } = useAxios();
  const [selectedLocation, setSelectedLocation] = useState<'all' | number>('all');
  const [locations, setLocations] = useState<Locations[]>([]);
  const [spots, setSpots] = useState<SpotsData[]>([]);
  const [loadingSpots, setLoadingSpots] = useState(true);
  const [loadingFilters, setLoadingFilters] = useState(true);

  const fetchSposts = async () => {
    setLoadingSpots(true);
    try {
      const { data } = await get('/tourist-spots/recommended/?location_id=' + selectedLocation, {
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

  const fetchLocations = async () => {
    setLoadingFilters(true);
    try {
      const { data } = await get('/location-spots/?all=true');
      const locations = data.results;
      setLocations(locations);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingFilters(false);
    }
  }

  useEffect(() => {
    fetchSposts();
  }, [selectedLocation]);

  useEffect(() => {
    fetchLocations();
  }, [])

  return (
    <View>
      <SpotList
        spots={spots}
        title="Lugares Cerca"
        filters={locations}
        setFilter={setSelectedLocation}
        loadingSpots={loadingSpots}
        loadingFilters={loadingFilters}
      />
    </View>
  );
}
