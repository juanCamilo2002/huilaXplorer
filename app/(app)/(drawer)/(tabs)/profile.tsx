import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { useSession } from '@/providers/SessionProvider';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const { signOut, userProfile } = useSession();

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? "light"].white }]}>
      <View style={styles.profileHeader}>
        <Image source={{ uri: userProfile?.img_profile }} style={styles.profileImage} />
        <Text style={styles.profileName}>
          {userProfile?.first_name} {userProfile?.last_name}
        </Text>
        <Text style={styles.profileEmail}>{userProfile?.email}</Text>
      </View>

      <View style={styles.profileDetails}>
        <View style={styles.infoRow}>
          <Text style={styles.infoTitle}>Teléfono:</Text>
          <Text style={styles.infoValue}>{userProfile?.phone_number}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoTitle}>Ultima sesión:</Text>
          <Text style={styles.infoValue}>{new Date(userProfile?.last_login ?? '').toLocaleDateString()}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoTitle}>Estado:</Text>
          <Text style={[styles.infoValue, { color: userProfile?.is_active ? 'green' : 'red' }]}>
            {userProfile?.is_active ? "Activo" : "Inactivo"}
          </Text>
        </View>

       

        <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
          <Text style={styles.signOutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileEmail: {
    fontSize: 16,
  },
  profileDetails: {
    width: '100%',
    paddingVertical: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
  },
  signOutButton: {
    marginTop: 20,
    backgroundColor: Colors.light.greenDark,
    paddingVertical: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signOutButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});
