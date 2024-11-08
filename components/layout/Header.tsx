import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useSession } from '@/providers/SessionProvider';
import { Badge, Image } from '@rneui/base';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { ParamListBase } from '@react-navigation/native';
import { useNavigation } from 'expo-router';

interface ButtonHeaderProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  onPress: () => void;
}

const ButtonHeader = ({ icon, onPress }: ButtonHeaderProps) => {
  const colorScheme = useColorScheme();
  return (
    <TouchableOpacity style={[styles.btnMenu, { borderColor: Colors[colorScheme ?? "light"].greenLight }]} onPress={onPress}>
      <Ionicons name={icon} size={30} color={Colors[colorScheme ?? "light"].black} />
    </TouchableOpacity>
  )
}



export default function Header() {
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();
  const { userProfile } = useSession();
  const colorScheme = useColorScheme();
  const image = userProfile?.img_profile
    ? { uri: userProfile?.img_profile }
    : require('@/assets/images/avatar.jpg');

  return (
    <View style={[styles.container, {
      backgroundColor: Colors[colorScheme ?? "light"].white,
      borderBottomColor: Colors[colorScheme ?? 'light'].greenLight
    }]}>
      {/* <View>
        <ButtonHeader icon="menu" onPress={() => navigation.toggleDrawer()} />
      </View> */}
      <Text style={styles.txtLogo}>HuilaXplorer</Text>
      <View style={styles.right}>
        {/* <ButtonHeader icon="notifications-outline" onPress={() => { }} />
        <Badge value="3" status="success" containerStyle={{ position: 'absolute', top: 5, left: 25 }} /> */}
        <Image
          source={image}
          style={styles.img}
        />
      </View>
    </View>
  )
}




const styles = StyleSheet.create({
  container: {
    height: 80,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  img: {
    width: 50,
    height: 50, borderRadius: 1000,
    objectFit: 'cover'
  },
  btnMenu: {
    padding: 5,
    width: 50,
    height: 50,
    borderRadius: 1000,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  txtLogo: {
    fontSize: 20,
    fontWeight: 'bold',
  }
});