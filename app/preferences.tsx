import BtnCustom from '@/components/BtnCustom';
import { Colors } from '@/constants/Colors';
import useAxios from '@/hooks/useAxios';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useSession } from '@/providers/SessionProvider';
import { router, useFocusEffect } from 'expo-router';
import { setStatusBarBackgroundColor } from 'expo-status-bar';
import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';


interface ActivitiesData {
  id: number;
  name: string;
  desciption: string;
}


const PreferencesScreen = () => {
  const { userProfile, fetchUserProfile, session } = useSession(); 
  const { get, patch } = useAxios();
  const colorScheme = useColorScheme();
  const [activities, setActivities] = useState<ActivitiesData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedActivities, setSelectedActivities] = useState<ActivitiesData[]>([]);

  const toggleActivity = (activity: ActivitiesData) => {
    if (selectedActivities.some(a => a.name === activity.name)) {
      setSelectedActivities(selectedActivities.filter(a => a.name !== activity.name));
    } else {
      setSelectedActivities([...selectedActivities, activity]);
    }
  };

  const savePreferences = async () => {
    const preferredActivities = selectedActivities.map(activity => ({name: activity.name})); 
    try {
      await patch(`/users/accounts/${userProfile?.id}/`, { preferred_activities: preferredActivities });
      
      if (session) {
        await fetchUserProfile(session);
      } else {
        Alert.alert('Error', 'Session is not available.');
      }
      router.push('/'); 
    } catch (error: any) {
      if (error.response) {
        Alert.alert('Error', error.response.data.detail);
      } else {
        Alert.alert('Error', 'Error de conexión o servidor.');
      }
    }
  };



  const fetchPreferences = async () => {
    setLoading(true);
    try {
      const { data } = await get('/activities-spots/?all=true');
      setActivities(data.results);
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPreferences();
    }, [])
  );

  setStatusBarBackgroundColor(Colors[colorScheme ?? 'light'].greenSoft, true);
  return (
    loading
      ? <Text>Cargando...</Text>
      : (
        <View style={[styles.container, {backgroundColor: Colors[colorScheme ?? "light"].greenSoft}]}>
          <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].greenDark }]}>¿Qué actividades te interesan?</Text>
          <Text style={styles.subtitle}>
            Selecciona al menos 3 actividades que más te gusten para personalizar tu experiencia.
          </Text>

          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.chipContainer}>
              {activities.map((activity, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.chip, selectedActivities.some(a => a.name === activity.name) && {
                    backgroundColor: Colors[colorScheme ?? 'light'].greenDark,
                    borderColor: Colors[colorScheme ?? 'light'].greenDark,
                  }]}
                  onPress={() => toggleActivity(activity)}
                >
                  <Text style={[styles.chipText, selectedActivities.some(a => a.name === activity.name) && {
                    color: Colors[colorScheme ?? 'light'].white,
                  }]}>{activity.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <BtnCustom title="Guardar Preferencias" onPress={savePreferences} disabled={selectedActivities.length < 3} />
          </View>
        </View>
      )
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  scrollContainer: {
    flexGrow: 1,
    marginBottom: 16,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginVertical: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    margin: 4,
  },
  selectedChip: {
    backgroundColor: '#6200ea',
    borderColor: '#6200ea',
  },
  chipText: {
    color: '#000',
  },
  buttonContainer: {
    paddingVertical: 16,
  },
});

export default PreferencesScreen;
