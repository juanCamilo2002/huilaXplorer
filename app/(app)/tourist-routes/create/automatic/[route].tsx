import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import React, { useState, useCallback } from 'react';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import useAxios from '@/hooks/useAxios';
import { useSession } from '@/providers/SessionProvider';
import { ActivityRoute, TouristRoute } from '@/constants/TouristRouteType';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { formatISO } from 'date-fns';


export default function Automatic() {
  const { route } = useLocalSearchParams();
  const { remove, put, get } = useAxios();
  const { session } = useSession();

  const [routeData, setRouteData] = useState<TouristRoute | null>(null);
  const [activities, setActivities] = useState<ActivityRoute[]>([]);
  const colorScheme = useColorScheme();

  const generateRoute = async () => {
    try {
      const { data: dataRoute } = await get('/tourist-routes/' + route, {
        headers: {
          Authorization: `Bearer ${session}`,
        }
      });
      setRouteData(dataRoute);

      const { data } = await get(`/tourist-routes/${route}/activities`, {
        headers: {
          Authorization: `Bearer ${session}`,
        },
      });
      setActivities(data.activities_for_route);
    } catch (error : any) {
      console.log(error);
      if (error.response) {
        console.log(error.response.data);
      }
    }
  };

  const acceptRoute = async () => {
    const routeUpdate = {
      name: routeData?.name || "Nombre de Ruta Predeterminado",
      description: routeData?.description || "Descripción Predeterminada",
      date_start: routeData?.date_start,
      date_end: routeData?.date_end,
      activity_routes: activities.map(activity => ({
        date: formatISO(new Date(activity.date)),  // Convierte la fecha al formato ISO 8601
        tourist_spot: activity.spot.id,
      })),
    };

    try {
      const { data } = await put(`/tourist-routes/update/${route}`, routeUpdate, {
        headers: {
          Authorization: `Bearer ${session}`,
        },
      });
      router.push('/my-routes');
    } catch (error: any) {
      console.log('Error al aceptar la ruta:', error);
      if (error.response) {
        console.log(error.response.data);
      }
    }
  };
  const rejectRoute = async () => {
    try {
      await remove(`/tourist-routes/delete/${route}`, {
        headers: {
          Authorization: `Bearer ${session}`,
        },
      });
      router.push('/my-routes');
    } catch (error: any) {
      if (error.response) {
        console.log(error.response.data);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      generateRoute();
    }, [])
  );

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? "light"].white }]}>
      {routeData && (
        <View style={styles.routeContainer}>
          <Text style={[styles.title, { color: Colors[colorScheme ?? "light"].greenDark }]}>Ruta: {routeData.name}</Text>
          <Text style={styles.dates}>Fechas: {routeData.date_start} - {routeData.date_end}</Text>

          <Text style={styles.subtitle}>Actividades Generadas:</Text>
          <FlatList
            data={activities}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={[styles.activityCard, { backgroundColor: Colors[colorScheme ?? "light"].ligthgray }]}>
                <Text style={[styles.activityDate, { color: Colors[colorScheme ?? "light"].greenDark }]}>{item.date}</Text>
                <Text style={styles.activityText}>Lugar: {item.spot.name}</Text>
                <Text style={styles.activityText}>{item.activity}</Text>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, { backgroundColor: Colors[colorScheme ?? "light"].greenDark }]} onPress={acceptRoute}>
              <Text style={styles.buttonText}>Aceptar Ruta</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.rejectButton]} onPress={()=>{
              rejectRoute()
              router.push('/my-routes')
              }}>
              <Text style={styles.buttonText}>Rechazar Ruta</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  routeContainer: {
    flex: 1,
    borderRadius: 8,
    padding: 16,
    backgroundColor: Colors.light.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  dates: {
    fontSize: 16,
    color: Colors.light.gray,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    marginVertical: 10,
  },
  activityCard: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
  },
  activityDate: {
    fontSize: 14,
    fontWeight: '600',
  },
  activityText: {
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },

  rejectButton: {
    backgroundColor: "red",
  },
  buttonText: {
    color: Colors.light.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
