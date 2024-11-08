import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useForm, Controller } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';

const schema = Yup.object().shape({
    name: Yup.string().required('El nombre es requerido'),
    description: Yup.string().required('La descripción es requerida'),
    date_start: Yup.date().required('La fecha de inicio es requerida'),
    date_end: Yup.date().required('La fecha de fin es requerida'),
});

type RouteFormProps = {
    onSubmit: (data: any) => void;
    initialValues?: {
        name: string;
        description: string;
        date_start: Date;
        date_end: Date;
    };
};

export default function RouteForm({ onSubmit, initialValues }: RouteFormProps) {
    const [step, setStep] = useState(1);
    const [showDateStartPicker, setShowDateStartPicker] = useState(false);
    const [showDateEndPicker, setShowDateEndPicker] = useState(false);
    const colorScheme = useColorScheme();

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: initialValues,
    });

    const nextStep = () => setStep(step + 1);
    const previousStep = () => setStep(step - 1);

    const handleFormSubmit = (data: any) => {
        const formattedData = {
            ...data,
            date_start: data.date_start ? data.date_start.toISOString().split('T')[0] : null,
            date_end: data.date_end ? data.date_end.toISOString().split('T')[0] : null,
        };
        
        onSubmit(formattedData);
    };

    return (
        <View style={styles.container}>
            {step === 1 && (
                <View style={styles.formStep}>
                    <Text style={styles.label}>Paso 1: Información Básica</Text>
                    <Controller
                        control={control}
                        name="name"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View style={styles.inputGroup}>
                                <Text style={styles.fieldLabel}>Nombre</Text>
                                <TextInput
                                    style={styles.input}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    placeholder="Ingresa el nombre"
                                />
                                {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
                            </View>
                        )}
                    />
                    <Controller
                        control={control}
                        name="description"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View style={styles.inputGroup}>
                                <Text style={styles.fieldLabel}>Descripción</Text>
                                <TextInput
                                    style={styles.input}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    placeholder="Ingresa la descripción"
                                />
                                {errors.description && <Text style={styles.errorText}>{errors.description.message}</Text>}
                            </View>
                        )}
                    />
                    <View style={styles.navigationButtons}>
                        <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={router.back}>
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, { backgroundColor: Colors[colorScheme ?? 'light'].greenDark}]} onPress={nextStep}>
                            <Text style={styles.buttonText}>Siguiente</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {step === 2 && (
                <View style={styles.formStep}>
                    <Text style={styles.label}>Paso 2: Fechas</Text>
                    <Controller
                        control={control}
                        name="date_start"
                        render={({ field: { onChange, value } }) => (
                            <View style={styles.inputGroup}>
                                <Text style={styles.fieldLabel}>Fecha de Inicio</Text>
                                <TouchableOpacity
                                    style={styles.dateButton}
                                    onPress={() => setShowDateStartPicker(true)}
                                >
                                    <Text style={styles.dateButtonText}>
                                        {value ? value.toDateString() : "Selecciona la fecha de inicio"}
                                    </Text>
                                </TouchableOpacity>
                                {showDateStartPicker && (
                                    <DateTimePicker
                                        value={value || new Date()}
                                        mode="date"
                                        display="default"
                                        onChange={(event, selectedDate) => {
                                            setShowDateStartPicker(false);
                                            if (selectedDate) {
                                                onChange(selectedDate);
                                            }
                                        }}
                                    />
                                )}
                                {errors.date_start && <Text style={styles.errorText}>{errors.date_start.message}</Text>}
                            </View>
                        )}
                    />
                    <Controller
                        control={control}
                        name="date_end"
                        render={({ field: { onChange, value } }) => (
                            <View style={styles.inputGroup}>
                                <Text style={styles.fieldLabel}>Fecha de Fin</Text>
                                <TouchableOpacity
                                    style={styles.dateButton}
                                    onPress={() => setShowDateEndPicker(true)}
                                >
                                    <Text style={styles.dateButtonText}>
                                        {value ? value.toDateString() : "Selecciona la fecha de fin"}
                                    </Text>
                                </TouchableOpacity>
                                {showDateEndPicker && (
                                    <DateTimePicker
                                        value={value || new Date()}
                                        mode="date"
                                        display="default"
                                        onChange={(event, selectedDate) => {
                                            setShowDateEndPicker(false);
                                            if (selectedDate) {
                                                onChange(selectedDate);
                                            }
                                        }}
                                    />
                                )}
                                {errors.date_end && <Text style={styles.errorText}>{errors.date_end.message}</Text>}
                            </View>
                        )}
                    />
                    <View style={styles.navigationButtons}>
                        <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={previousStep}>
                            <Text style={styles.buttonText}>Anterior</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, { backgroundColor: Colors[colorScheme ?? 'light'].greenDark}]} onPress={handleSubmit(handleFormSubmit)}>
                            <Text style={styles.buttonText}>Enviar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        width: '100%',
        flex: 1,
    },
    formStep: {
        width: '100%',
        marginBottom: 20,
    },
    label: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        textAlign: 'center',
    },
    fieldLabel: {
        fontSize: 16,
        color: '#666',
        marginBottom: 5,
    },
    inputGroup: {
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#fff',
        fontSize: 16,
        color: '#333',
    },
    errorText: {
        color: '#d9534f',
        fontSize: 14,
        marginTop: 5,
    },
    button: {
        flex: 1,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonSecondary: {
        backgroundColor: '#6c757d',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    dateButton: {
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#e9ecef',
        alignItems: 'center',
    },
    dateButtonText: {
        color: '#495057',
        fontSize: 16,
    },
    navigationButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
});
