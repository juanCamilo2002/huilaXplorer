import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Activity, SpotsData } from '@/constants/SpotsType';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import AddSpotToRouteModal from './AddSpotToRouteModal';

type ActivitiesAboutProps = {
  activities: Activity[];
};

const ActivitiesAbout = ({ activities }: ActivitiesAboutProps) => {
  const colorScheme = useColorScheme();
  return (
    <View style={styles.activitiesContainer}>
      {activities.map((activity, index) => (
        <View key={index} style={[styles.activity, { backgroundColor: Colors[colorScheme ?? "light"].greenLight }]}>
          <Text style={[styles.textActivity, { color: Colors[colorScheme ?? "light"].greenDark }]}>{activity.name}</Text>
        </View>
      ))}
    </View>
  );
};

type SpotAboutProps = {
  spot: SpotsData;
};

export default function SpotAbout({ spot }: SpotAboutProps) {
  const colorScheme = useColorScheme();
  const [isExpanded, setIsExpanded] = useState(false);

  // Limita el texto de la descripción
  const MAX_LENGTH = 100;
  const descriptionText = isExpanded
    ? spot.description
    : spot.description.length > MAX_LENGTH
      ? `${spot.description.slice(0, MAX_LENGTH)}...`
      : spot.description;

  const [isModalVisible, setIsModalVisible] = useState(false);

  const closeModal = () => {
    setIsModalVisible(false);
  }

  return (
    <View style={styles.container}>
      <ActivitiesAbout activities={spot.activities} />
      <View style={styles.details}>
        <Text style={styles.name}>{spot.name}</Text>
        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
          <View style={styles.locate}>
            <Ionicons name="locate" size={20} color="black" />
            <Text style={[styles.locateName, { color: Colors[colorScheme ?? "light"].gray }]}>{spot.location.name}</Text>
          </View>
          <TouchableOpacity onPress={() => setIsModalVisible(true)}>
            <Ionicons name='add' size={20} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.descContainer}>
          <Text style={[styles.descTitle, { color: Colors[colorScheme ?? "light"].gray }]}>Acerca de</Text>
          <Text style={styles.description}>{descriptionText}</Text>
          {spot.description.length > MAX_LENGTH && (
            <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
              <Text style={[styles.readMore, { color: Colors[colorScheme ?? "light"].greenDark }]}>{isExpanded ? 'Leer menos' : 'Leer más'}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <AddSpotToRouteModal isVisible={isModalVisible} onBackdropPress={closeModal} soptId={spot.id}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  activitiesContainer: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  activity: {
    backgroundColor: 'red',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 100,
  },
  textActivity: {
    fontWeight: '500',
  },
  details: {
    marginTop: 15,
  },
  name: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  locate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 5,
  },
  locateName: {
    fontSize: 16,
  },
  descContainer: {
    marginTop: 30,
  },
  descTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    fontWeight: '300',
  },
  readMore: {
    marginTop: 5,
    fontWeight: 'bold',
  },
});
