import { TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useThemeColor } from '@/hooks/useThemeColor';

interface LoginBtnProviderProps {
    onPress: () => void;
    image: string;
}

export default function LoginBtnProvider({ onPress, image }: LoginBtnProviderProps) {
    const backgroundColor = useThemeColor({}, 'greenLight');
    return (
        <TouchableOpacity style={[styles.provider, { backgroundColor }]} onPress={onPress}>
            <Image
                style={styles.image}
                source={{ uri: image }}
                placeholder=''
                contentFit="cover"
                transition={1000}
            />
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    image: {
        width: 50,
        height: 50,
        borderRadius: 50,
    },
    provider: {
        borderRadius: 8,
        padding: 10,
        width: 114,
        height: 70,
        alignItems: 'center',
    },
});