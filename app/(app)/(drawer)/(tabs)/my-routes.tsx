import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, { useCallback, useState } from 'react'
import Header from '@/components/layout/Header'
import { Colors } from '@/constants/Colors';
import { FAB } from '@rneui/base';
import { useColorScheme } from '@/hooks/useColorScheme';
import CardRoute from '@/components/my-routes/CardRoute';
import useAxios from '@/hooks/useAxios';
import { useSession } from '@/providers/SessionProvider';
import { TouristRoute } from '@/constants/TouristRouteType';
import { useFocusEffect } from 'expo-router';
import ModalCreateRoutes from '@/components/my-routes/ModalCreateRoutes';
import CardRouteSkeleton from '@/components/my-routes/skeleton/CardRouteSkeleton';

export default function RoutesTab() {
  const colorScheme = useColorScheme();

  const [loading, setLoading] = useState<boolean>(false);
  const [touristRoutes, setTouristRoutes] = useState<TouristRoute[]>([]);

  const [modalVisible, setModalVisible] = useState(false);

  const { get } = useAxios();
  const { session } = useSession();

  const fetchTouristRoute = async () => {
    setLoading(true);
    try {
      const { data } = await get('/tourist-routes/me', {
        headers: {
          Authorization: `Bearer ${session}`
        }
      });
      setTouristRoutes(data);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchTouristRoute();
    }, [])
  );

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? "light"].white }]}>
      <Header />

      <ScrollView style={styles.scrollView}>
        <Text style={[styles.title, { color: Colors[colorScheme ?? "light"].greenDark }]}>Tus Rutas</Text>

        {
          loading ? (
            <View>
              <CardRouteSkeleton />
              <CardRouteSkeleton />
            </View>
          ) : touristRoutes.length > 0 ? (
            <>
              {touristRoutes.map((route) => (
              <CardRoute
                key={route.id}
                route={route}
                setTouristRoutes={setTouristRoutes}
                touristRoutes={touristRoutes}
              />
            ))}
            <View style={{ height: 150 }} />

            </>
          ) : (
            <Text style={styles.emptyMessage}>No tienes rutas creadas</Text>
          )
        }
      </ScrollView>

      <FAB
        title="Agregar"
        upperCase
        icon={{ name: 'add', color: 'white' }}
        style={styles.fab}
        color={Colors[colorScheme ?? 'light'].greenDark}
        onPress={() => setModalVisible(true)}
      />
      <ModalCreateRoutes modalVisible={modalVisible} setModalVisible={setModalVisible} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 80, 
    zIndex: 9999, 
  },
  emptyMessage: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },

});
