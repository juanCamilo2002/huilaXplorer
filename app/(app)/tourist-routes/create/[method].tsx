import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import RouteForm from '@/components/my-routes/forms/route-form/RouteForm';
import useAxios from '@/hooks/useAxios';
import { TouristRoute } from '@/constants/TouristRouteType';

export default function CreateRoute() {
  const { method } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const { post } = useAxios();

  const createRoute = async (data: TouristRoute) => {
    data.activity_routes = [];
    try {
      const {data: result} = await post('/tourist-routes/create', data);
      return  result;
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = async  (data: TouristRoute) => {

    const route = await createRoute(data);

    if (method === 'automatic') {
      router.push(`/tourist-routes/create/automatic/${route.id}`);
    } else {
      router.push('/my-routes');
    }



  }
  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? "light"].white }]}>
      <RouteForm onSubmit={handleSubmit} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})