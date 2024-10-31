import React, { useEffect, useRef, useState } from 'react';
import MapView, { Marker, Callout } from 'react-native-maps';
import { StyleSheet, View, TouchableOpacity, Text, Dimensions } from 'react-native';
import { SpotsData } from '@/constants/SpotsType';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Link, router } from 'expo-router';
import CardSpot from './CardSpot';
import { Image } from 'expo-image';

type MapProps = {
  markers: SpotsData[];
}

const widthScreen = Dimensions.get('window').width;

export default function Map({ markers }: MapProps) {
  const colorScheme = useColorScheme();
  const mapRef = useRef<MapView | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [region, setRegion] = useState({
    latitude: 2.39341,
    longitude: -75.89232,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permission to access location was denied');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    })();
  }, []);

  const zoomIn = () => {
    setRegion(prevRegion => ({
      ...prevRegion,
      latitudeDelta: prevRegion.latitudeDelta / 2,
      longitudeDelta: prevRegion.longitudeDelta / 2,
    }));
  };

  const zoomOut = () => {
    setRegion(prevRegion => ({
      ...prevRegion,
      latitudeDelta: prevRegion.latitudeDelta * 2,
      longitudeDelta: prevRegion.longitudeDelta * 2,
    }));
  };

  const focusLocation = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: region.latitudeDelta,
        longitudeDelta: region.longitudeDelta,
      }, 1000);
    }
  };

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(region, 1000);
    }
  }, [region]);

  const renderStars = (spot: SpotsData) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      let iconName: 'star-outline' | 'star' | 'star-half' = 'star-outline';
      if (i <= spot.average_rating) {
        iconName = 'star';
      } else if (i - 0.5 <= spot.average_rating) {
        iconName = 'star-half';
      }
      stars.push(
        <Ionicons
          key={i}
          name={iconName}
          size={20}
          color={Colors[colorScheme ?? 'light'].greenLight}
          style={{ marginRight: 1 }}
        />
      );
    }
    return stars;
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        showsUserLocation={true}
        showsMyLocationButton={false}
        zoomControlEnabled={false}
      >
        {markers.map(marker => (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: parseFloat(marker.latitude.toString()),
              longitude: parseFloat(marker.longitude.toString()),
            }}
            title={marker.name}
            description={marker.description}
          >
            <Callout>
              <View style={[styles.calloutContainer, { backgroundColor: Colors[colorScheme ?? "light"].white }]}>
                <Image source={{ uri: marker.images[0].image }} style={styles.calloutImage} />
                <View style={styles.calloutDescription}>
                  <Text style={styles.calloutTitle}>{marker.name}</Text>
                  <Text style={styles.calloutDesc}>{marker.location.name}</Text>
                  <View style={styles.starsContainer}>{renderStars(marker)}</View>
                  <TouchableOpacity
                    onPress={() => router.navigate({
                      pathname: '/place-details/[id]',
                      params: { id: marker.id }
                    }) }
                    style={{ marginTop: 10 }}
                  >
                    <Text style={{ color: Colors[colorScheme ?? "light"].greenDark }}>Ver detalles</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, { backgroundColor: Colors[colorScheme ?? "light"].greenDark }]} onPress={zoomIn}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: Colors[colorScheme ?? "light"].greenDark }]} onPress={zoomOut}>
          <Ionicons name="remove" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: Colors[colorScheme ?? "light"].greenDark }]} onPress={focusLocation}>
          <Ionicons name="locate" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    position: 'absolute',
    left: 10,
    top: 10,
    flexDirection: 'column',
    alignItems: 'center',
  },
  button: {
    borderRadius: 30,
    margin: 5,
    elevation: 5,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  calloutContainer: {
    width: widthScreen * 0.8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  calloutDescription: {
    padding: 10,
  },
  calloutDesc: {
    color: 'gray',
    marginVertical: 5,
  },
  calloutImage: {
    width: "100%",
    height: 150,
    objectFit: 'cover',
  },
  starsContainer: {
    flexDirection: 'row',
    marginVertical: 5,
  }
});
