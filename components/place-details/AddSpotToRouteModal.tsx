import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useState } from 'react';
import { Dialog, Button } from '@rneui/base';
import { useSession } from '@/providers/SessionProvider';
import useAxios from '@/hooks/useAxios';
import { TouristRoute } from '@/constants/TouristRouteType';
import { useFocusEffect } from 'expo-router';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Platform } from 'react-native';

type AddSpotToRouteModalProps = {
  isVisible: boolean;
  onBackdropPress: () => void;
  soptId: number;
};

// Esquema de validación con Yup
const schema = Yup.object().shape({
  routeId: Yup.number().required('La ruta es requerida'),
  date: Yup.date().required('La fecha es requerida'),
});


export default function AddSpotToRouteModal({ isVisible, onBackdropPress, soptId }: AddSpotToRouteModalProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const { session } = useSession();
  const { get, put } = useAxios();
  const [touristRoutes, setTouristRoutes] = useState<TouristRoute[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<TouristRoute | null>(null);
  const [date, setDate] = useState<Date>(new Date());
  const colorScheme = useColorScheme();
  const renderDatePicker = () => {
    if (Platform.OS === 'android' && showDatePicker) {
      return (
        <DateTimePicker
          value={date}
          mode="datetime"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false); // Oculta el selector inmediatamente después de la selección
            if (event.type !== "dismissed") { // Verifica que no se haya cancelado
              const currentDate = selectedDate || date;
              setDate(currentDate);
              setValue('date', currentDate); // Establece la fecha en el formulario
            }
          }}
        />
      );
    }
    return null;
  };

  const { control, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      routeId: undefined,
      date: new Date(),
    },
  });

  const fetchTouristRoute = async () => {
    setLoading(true);
    try {
      const { data } = await get('/tourist-routes/me', {
        headers: {
          Authorization: `Bearer ${session}`,
        },
      });
      setTouristRoutes(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTouristRoute();
    }, [])
  );

  const handleAddActivity = async (data: { routeId: number; date: Date }) => {
    // Intenta actualizar la ruta con la fecha y spotId
    console.log(data);
    const route = touristRoutes.find((route) => route.id === data.routeId);
    if (!route) return;
    const dataUpdate = {
      ...route,
      activity_routes: [
        ...route.activity_routes,
        {
          date: data.date.toISOString(),
          tourist_spot: soptId,
        },
      ]
    }
    try {
      await put(`/tourist-routes/update/${data.routeId}`, dataUpdate, {
        headers: {
          Authorization: `Bearer ${session}`,
        },
      });
      onBackdropPress();
    } catch (error: any) {
      console.log(error);
      if (error.response) {
        console.log(error.response.data);
      }

    }
  };

  return (
    <Dialog
      isVisible={isVisible}
      onBackdropPress={onBackdropPress}
      overlayStyle={{ backgroundColor: Colors[colorScheme ?? "light"].white }}
    >
      <Text style={styles.title}>Selecciona una Ruta</Text>
      <FlatList
        data={touristRoutes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.routeItem,
              selectedRoute?.id === item.id && styles.selectedRouteItem,
            ]}
            onPress={() => {
              setSelectedRoute(item);
              setValue('routeId', item.id); // Establecer el ID de la ruta en el formulario
            }}
          >
            <Text style={styles.routeName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      {errors.routeId && <Text style={styles.errorText}>{errors.routeId.message}</Text>}

      <Controller
        control={control}
        name="date"
        render={({ field: { onChange, value } }) => (
          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>Fecha de Fin</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateButtonText}>
                {value ? value.toDateString() : "Selecciona la fecha de fin"}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={value || new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    onChange(selectedDate);
                  }
                }}
              />
            )}
            {errors.date && <Text style={styles.errorText}>{errors.date.message}</Text>}
          </View>
        )}
      />


      {errors.date && <Text style={styles.errorText}>{errors.date.message}</Text>}

      <Button
        title="Agregar Actividad"
        onPress={handleSubmit(handleAddActivity)}
        disabled={!selectedRoute || loading}
      />
    </Dialog>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  routeItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  selectedRouteItem: {
    backgroundColor: '#e0e0e0',
  },
  routeName: {
    fontSize: 16,
  },
  dateButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
  fieldLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  dateButtonText: {
    color: '#666',
  },
});
