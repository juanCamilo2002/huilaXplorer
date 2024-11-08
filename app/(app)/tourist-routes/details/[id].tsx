import { StyleSheet, Text, View, Image, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useLocalSearchParams } from 'expo-router';
import useAxios from '@/hooks/useAxios';
import { ActivityRoute, TouristRoute } from '@/constants/TouristRouteType';
import { useSession } from '@/providers/SessionProvider';
import { SpotsData } from '@/constants/SpotsType';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Skeleton } from '@rneui/base';

type RenderActivityProps = {
  item: ActivityRoute;
  handleDelete: (id: number) => void;
}

const RenderActivity = ({ item, handleDelete }: RenderActivityProps) => {
  // Formateo de la fecha y hora
  const activityDate = parseISO(item.date);
  const formattedDate = format(activityDate, 'dd MMMM ', { locale: es });
  const formattedTime = format(activityDate, 'HH:mm', { locale: es });
  const colorScheme = useColorScheme();
  const { session } = useSession();
  const { get } = useAxios();
  const [spot, setSpot] = useState<SpotsData>();
  const [loading, setLoading] = useState(true);

  const fetchSpot = async () => {
    setLoading(true);
    try {
      const { data } = await get(`/tourist-spots/${item.tourist_spot}/`, {
        headers: { Authorization: `Bearer ${session}` },
      });
      setSpot(data);
    } catch (error) {
      console.error(error);
      return 'Desconocido';
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSpot();
  }, []);

  return (
    loading ? (
      <View style={{ backgroundColor: Colors[colorScheme ?? "light"].greenSoft, padding: 10, marginTop: 5  }} >
        <Skeleton height={20} width={100} />
        <Skeleton height={20} width={100} style={{ marginTop: 10 }} />
      </View>
    ) : (
      <View style={[styles.activityCard, { backgroundColor: Colors[colorScheme ?? "light"].greenSoft }]}>
        <View>
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.activityDate, { color: Colors[colorScheme ?? "light"].greenDark }]}>
              {formattedDate}
            </Text>
            <Text style={[styles.activityDate, { color: Colors[colorScheme ?? "light"].greenDark }]}>
              {formattedTime}
            </Text>
          </View>
          <Text style={[styles.activitySpot, { color: Colors[colorScheme ?? "light"].greenDark }]}>
            {spot?.name}
          </Text>
        </View>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Text style={[styles.activitySpot, { color: "red" }]}>
            Eliminar
          </Text>
        </TouchableOpacity>
      </View>
    )
  );
};


export default function RouteDetail() {
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const [route, setRoute] = React.useState<TouristRoute | null>(null);
  const { get, put } = useAxios();
  const { session } = useSession();

  const fetchRoute = async () => {
    // fetch route details
    try {
      const { data } = await get(`/tourist-routes/${id}`, {
        headers: { Authorization: `Bearer ${session}` },
      });
      setRoute(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchRoute();
  }, [id]);

  const HandleDeleteActivity = async (id: number) => {
    if (!route) return;

    const routeData = {
      ...route,
      activity_routes: route.activity_routes.filter((activity) => activity.id !== id),
    }
    try {
      await put(`/tourist-routes/update/${route.id}`, routeData, {
        headers: { Authorization: `Bearer ${session}` },
      });
      fetchRoute();
    } catch (error: any) {
      console.error(error);
      if (error.response) {
        console.log(error.response.data);
      }
    }
  }

  return (
    <View
      style={[styles.container, { backgroundColor: Colors[colorScheme ?? "light"].white }]}
    >
      {route ? (
        <View >
          {/* Imagen de la ruta */}

          {/* Detalles de la ruta */}
          <View style={styles.detailsContainer}>
            <Text style={[styles.routeTitle, { color: Colors[colorScheme ?? "light"].greenDark }]}>
              {route.name}
            </Text>
            <Text style={styles.routeDate}>
              {`Fecha de inicio: ${route.date_start} `}
            </Text>
            <Text style={styles.routeDate}>
              {`Fecha de Fin: ${route.date_end} `}
            </Text>
            <Text style={[styles.routeDescription, { color: Colors[colorScheme ?? "light"].black }]}>
              {route.description}
            </Text>

            {/* Lista de actividades */}
            <Text style={[styles.activitiesHeader, { color: Colors[colorScheme ?? "light"].greenDark }]}>Actividades:</Text>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={route.activity_routes}
              renderItem={({ item }) => <RenderActivity item={item} handleDelete={HandleDeleteActivity} />}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.activitiesContainer}
            />
          </View>
        </View>
      ) : (
        <Text style={[styles.loadingText, { color: Colors[colorScheme ?? "light"].ligthgray }]}>
          Cargando detalles de la ruta...
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden',
  },
  routeImage: {
    width: '100%',
    height: 200,
  },
  detailsContainer: {
    padding: 16,
  },
  routeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  routeDate: {
    fontSize: 16,
    color: '#888',
    marginTop: 4,
  },
  routeDescription: {
    fontSize: 16,
    lineHeight: 22,
    marginTop: 12,
  },
  activitiesHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  activitiesContainer: {
    marginTop: 10,
  },
  activityCard: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityDate: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  activitySpot: {
    fontSize: 14,
    color: '#555',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});
