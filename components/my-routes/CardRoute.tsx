import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TouristRoute } from '@/constants/TouristRouteType';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Dialog } from '@rneui/base';
import { calculateDaysAndNights } from '@/app/utils/date';
import { format } from 'date-fns';

import { es } from 'date-fns/locale';
import useAxios from '@/hooks/useAxios';
import ModalOptionsCardRoute from './ModalOptionsCardRoute';

type CardRouteProps = {
  route: TouristRoute;
  setTouristRoutes: (value: TouristRoute[]) => void;
  touristRoutes: TouristRoute[];
}

export default function CardRoute({ route, setTouristRoutes, touristRoutes }: CardRouteProps) {
  const colorScheme = useColorScheme();
  const [modalVisible, setModalVisible] = useState(false);

  const { remove } = useAxios();

  const handleOpenDetails = () => {
    router.navigate({
      pathname: '/(app)/tourist-routes/details/[id]',
      params: { id: route.id },
    });
  };

  const handleEdit = () => {
    setModalVisible(false);
    router.navigate({
      pathname: '/(app)/tourist-routes/edit/[id]',
      params: { id: route.id },
    });
  };

  const deleteRoute = async () => {
    setModalVisible(false);
    try {
      await remove(`/tourist-routes/delete/${route.id}`);
    } catch (error : any) {
      if (error.response) {
        console.log(error.response.data);
      }
    }
  }

  const handleDelete = () => {
    setModalVisible(false);
    deleteRoute();
    setTouristRoutes(touristRoutes.filter((r) => r.id !== route.id));
  };

  const toggleDialog = () => {
    setModalVisible(!modalVisible);
  };

  const { days, nights } = calculateDaysAndNights(route.date_start, route.date_end);
  const formattedStartDate = format(new Date(route.date_start), 'dd MMMM', { locale: es });
  const formattedEndDate = format(new Date(route.date_end), 'dd MMMM', { locale: es });

  return (
    <TouchableOpacity style={styles.container} onPress={handleOpenDetails}>
      <View style={styles.header}>
        <Text style={styles.name}>{route.name}</Text>

        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="ellipsis-vertical" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.wrapper}>
        <View style={[styles.status, { backgroundColor: Colors[colorScheme ?? "light"].greenDark }]}>
          <Text style={styles.statusText}>Completado</Text>
        </View>
        <Text style={styles.date}>{formattedStartDate} - {formattedEndDate}</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.infoText}>{route.activity_routes.length} Lugares para visitar</Text>
        <Text style={styles.infoText}>{days} días - {nights} noches</Text>
      </View>

      <ModalOptionsCardRoute
        modalVisible={modalVisible}
        toggleDialog={toggleDialog}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />

    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 20,
    marginHorizontal: 1,
    marginVertical: 5,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flexShrink: 1,
  },
  status: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    gap: 8,
  },
  date: {
    fontSize: 14,
    color: '#555',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#777',
  },
 
});
