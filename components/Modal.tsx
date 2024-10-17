import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

import { Overlay, Button, Icon } from '@rneui/base';

import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

interface ModalProps {
    isModalVisible: boolean;
    closeModal: () => void;
    errorMessage: string;
}


export default function Modal({ isModalVisible, closeModal, errorMessage }: ModalProps) {
    const colorScheme = useColorScheme();
    return (
        <Overlay
            isVisible={isModalVisible}
            onBackdropPress={closeModal}
            overlayStyle={[styles.overlayStyle, { backgroundColor: Colors[colorScheme ?? "light"].white }]} 
        >
            <View style={styles.modalContent}>
                <Icon name="warning" type="material" color="red" size={50} />
                <Text style={[styles.modalText, { color: Colors[colorScheme ?? "light"].black }]}>{errorMessage}</Text>
                <Button
                    title="Cerrar"
                    buttonStyle={[styles.closeButton, { backgroundColor: Colors[colorScheme ?? "light"].greenDark }]}
                    onPress={closeModal}
                />
            </View>
        </Overlay>
    )
}

const styles = StyleSheet.create({
    overlayStyle: {
        width: '80%',
        borderRadius: 15, // Esquinas redondeadas
        padding: 20,
        shadowColor: '#000', // Sombra
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5, // Para Android
    },
    modalContent: {
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        marginVertical: 15, // Espaciado vertical
        textAlign: 'center',
    },
    closeButton: {
        borderRadius: 10, // Esquinas redondeadas
    },
}) 