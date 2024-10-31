import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

type FilterProps = {
    filters: Filter[];
    setFilter?: (selectedFilters: { [key: string]: number }) => void;
    name: string;
    filter: { [key: string]: number };
}

type Filter = {
    id: number;
    name: string;
}

type RenderChipProps = {
    item: Filter;
    onSelect: (item: Filter) => void;
}

export default function FilterList({ filters, setFilter, name, filter }: FilterProps) {
    const colorScheme = useColorScheme();
    const [selected, setSelected] = useState<number | ''>(filter[name] ?? '');

    const handleSelect = (item: Filter) => {
        setSelected(item.id);
        
        if (setFilter) {
            setFilter({ ...filter, [name]: item.id });
        }
    };

    // Efecto para actualizar `selected` cuando `filter` cambia
    useEffect(() => {
        setSelected(filter[name] ?? '');
    }, [filter, name]);

    const renderChip = ({ item, onSelect }: RenderChipProps) => (
        <TouchableOpacity
            onPress={() => onSelect(item)}
            style={[
                styles.chip,
                selected === item.id && { backgroundColor: Colors[colorScheme ?? "light"].greenDark }
            ]}
        >
            <Text style={[
                styles.chipText,
                selected === item.id && { color: Colors[colorScheme ?? "light"].white }
            ]}>
                {item.name}
            </Text>
        </TouchableOpacity>
    );

    return (
        <FlatList
            data={filters}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => renderChip({ item, onSelect: handleSelect })}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipContainer}
        />
    );
}

const styles = StyleSheet.create({
    chipContainer: {
        marginBottom: 20,
    },
    chip: {
        padding: 10,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        marginRight: 10,
    },
    chipText: {
        color: 'black',
        fontWeight: 'bold',
    },
});
