import { useSession } from '@/providers/SessionProvider';
import { Link } from 'expo-router';
import { StyleSheet, View, Text, Button } from 'react-native';


export default function HomeScreen() {
  const { signOut, userProfile } = useSession();

  return (
    <View>
       <Text style={{color: "white"}} >Home</Text>
       <Link
        href='/sign-in'
        style={{color: "white", paddingTop: 40}}
       >
          login
       </Link>
       <Link
        href='/sign-up'
        style={{color: "white", paddingTop: 40}}
       >
          register
       </Link>
        <Text style={{color: "black"}} >{userProfile?.email}</Text>
       <Button onPress={signOut} title="Cerrar sesión" />
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
