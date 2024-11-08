import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { Dialog } from '@rneui/base'
import { Ionicons } from '@expo/vector-icons';

type ModalOptionsCardRouteProps = {
  modalVisible: boolean;
  toggleDialog: () => void;
  handleEdit: () => void;
  handleDelete: () => void;
}


export default function ModalOptionsCardRoute({
  modalVisible,
  toggleDialog, handleEdit,
  handleDelete
}: ModalOptionsCardRouteProps) {
  return (
    <Dialog
      isVisible={modalVisible}
      onBackdropPress={toggleDialog}
      backdropStyle={styles.modalOverlay}
      overlayStyle={styles.dialogContent}
    >
      <Dialog.Title title="Opciones" titleStyle={styles.dialogTitle} />

      <View style={styles.dialogOptionContainer}>
        <TouchableOpacity style={styles.modalOption} onPress={handleEdit}>
          <Ionicons name="create-outline" size={18} color="#4A90E2" style={styles.optionIcon} />
          <Text style={styles.optionText}>Editar</Text>
        </TouchableOpacity>

        <View style={styles.optionSeparator} />

        <TouchableOpacity style={styles.modalOption} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={18} color="#E74C3C" style={styles.optionIcon} />
          <Text style={styles.optionText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </Dialog >

  )
}

const styles = StyleSheet.create({
  dialogContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  dialogOptionContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    justifyContent: 'center',
    width: '100%',
  },
  optionSeparator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    width: '80%',
    alignSelf: 'center',
    marginVertical: 10,
  },
  optionIcon: {
    marginRight: 8,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  modalOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
})