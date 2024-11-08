import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import RouteForm from '@/components/my-routes/forms/route-form/RouteForm';
import { TouristRoute as OriginalTouristRoute } from '@/constants/TouristRouteType';
import { router, useLocalSearchParams } from 'expo-router';
import useAxios from '@/hooks/useAxios';
import { useSession } from '@/providers/SessionProvider';

type TouristRoute = Omit<OriginalTouristRoute, 'date_start' | 'date_end'> & {
  date_start: Date;
  date_end: Date;
};

export default function EditRouteScreen() {
  const colorScheme = useColorScheme();
  const { id } = useLocalSearchParams();
  const { get, put } = useAxios();
  const { session } = useSession();
  const [route, setRoute] = useState<TouristRoute | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const FetchRoute = async () => {
    setLoading(true);
    try {
      const { data } = await get(`/tourist-routes/${id}`, {
        headers: {
          Authorization: `Bearer ${session}`
        }
      });

      const { date_start, date_end } = data;
      data.date_start = new Date(date_start);
      data.date_end = new Date(date_end);
 
      setRoute(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    FetchRoute();
  }, [session]);



  const handleFormSubmit = async (data: TouristRoute) => {
    data.activity_routes = route?.activity_routes ?? [];
    try {
      await put(`/tourist-routes/update/${id}`, data);
      router.push('/my-routes');
    } catch (error : any) {
      if (error.response) {
        console.log(error.response.data);
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? "light"].white }]}>
       {loading 
       ? (<Text>Cargando...</Text>) 
       : (
        <RouteForm onSubmit={handleFormSubmit} initialValues={route ?? undefined} />
       )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
