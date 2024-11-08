import { Dimensions, ImageBackground, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Dialog } from '@rneui/base'
import { TouchableOpacity } from 'react-native'
import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import { router } from 'expo-router'

type ModalCreateRoutesProps = {
  modalVisible: boolean;
  setModalVisible: (value: boolean) => void;
}

const screenWith = Dimensions.get('screen').width;

export default function ModalCreateRoutes({ modalVisible, setModalVisible }: ModalCreateRoutesProps) {
  const colorScheme = useColorScheme();

  return (
    <Dialog
      isVisible={modalVisible}
      onBackdropPress={() => setModalVisible(false)}
      backdropStyle={styles.modalOverlay}
      overlayStyle={styles.modalContainer}
    >
      <ImageBackground
        source={{ uri: `https://picsum.photos/${screenWith * 0.9}/450` }}
        resizeMode='cover'
        style={styles.imageBackground}
      >
        <View style={styles.textContainer}>
          <Text style={[styles.text, styles.textTitle]}>¿Listo para comenzar tu viaje?</Text>
          <Text style={[styles.text, styles.textDescription]}>
            Crea tu ruta perfecta: deja que te ayudemos con una ruta automática o personalízala manualmente para hacerla única.
          </Text>
        </View>
        <View style={styles.btnContainer}>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: Colors[colorScheme ?? "light"].greenDark }]}
            onPress={() => {
              setModalVisible(false);
              router.push({
              pathname: '/tourist-routes/create/[method]',
              params: {
                method: 'automatic'
              }
              
            })}}>
            <Text style={[styles.btntext, { color: Colors[colorScheme ?? "light"].white}]}>Generar automaticamente</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={() => {
            setModalVisible(false);
            router.push({
            pathname: '/tourist-routes/create/[method]',
            params: {
                method: 'manual'
              }
          })}}>
            <Text style={styles.btntext}>Generar manualmente</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </Dialog>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '90%',
    height: 450,
    padding: 0,
    overflow: "hidden"
  },
  modalOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  textContainer: {
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    padding: 20,
    borderRadius: 12,
  },
  text: {
    textAlign: 'center',
    marginBottom: 20,
  },
  textTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  textDescription: {
    fontSize: 13,
  },
  btnContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  btn: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 12,
    width: '90%',
    alignItems: 'center',
    marginBottom: 10,
  },
  btntext: {
    fontSize: 16,
    fontWeight: 'bold',
  }
})