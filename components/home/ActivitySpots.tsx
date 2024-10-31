import { View, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSession } from '@/providers/SessionProvider';
import useAxios from '@/hooks/useAxios';
import { SpotsData } from '@/constants/SpotsType';
import SpotList from '../spots/SpotList';

type Activities = {
  id: number;
  name: string;
}

export default function ActivitySpots() {
  const { session } = useSession();
  const { get } = useAxios();
  const [selectedLocation, setSelectedLocation] = useState<'all' | number>('all');
  const [activities, setActivities] = useState<Activities[]>([]);
  const [spots, setSpots] = useState<SpotsData[]>([]);
  const [loadingSpots, setLoadingSpots] = useState(true);
  const [loadingFilters, setLoadingFilters] = useState(true);

  const fetchSposts = async () => {
    setLoadingSpots(true);
    try {
      const { data } = await get('/tourist-spots/recommended/?activity_id=' + selectedLocation, {
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
  };


  const fetchActivities = async () => {
    setLoadingFilters(true);
    try {
      const { data } = await get('/activities-spots/?all=true');
      const activities = data.results;
      setActivities(activities);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingFilters(false);
    }
  }

  useEffect(() => {
    fetchSposts();
  }, [selectedLocation]);

  useEffect(()=> {
    fetchActivities();
  }, [])

  return (
    <View style={styles.container}>
      <SpotList
        spots={spots}
        title="Lugares por Actividad"
        filters={activities}
        setFilter={setSelectedLocation}
        loadingSpots={loadingSpots}
        loadingFilters={loadingFilters}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 100,
  }
});