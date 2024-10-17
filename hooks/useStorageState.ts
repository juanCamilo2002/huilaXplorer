import { useEffect, useCallback, useReducer } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

function useAsyncState<T>(
  initialValue: [boolean, T | null] = [true, null],
): UseStateHook<T> {
  return useReducer(
    (state: [boolean, T | null], action: T | null = null): [boolean, T | null] => [false, action],
    initialValue
  ) as UseStateHook<T>;
}

// Función para establecer un valor en el almacenamiento, dependiendo de la plataforma
export async function setStorageItemAsync(key: string, value: string | null) {
  try {
    if (Platform.OS === 'web') {
      if (value === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, value);
      }
    } else {
      if (value == null) {
        await SecureStore.deleteItemAsync(key);
      } else {
        await SecureStore.setItemAsync(key, value);
      }
    }
  } catch (e) {
    console.error('Error setting storage item:', e);
  }
}

// Hook para obtener y establecer el valor en almacenamiento local o seguro
export function useStorageState(key: string): UseStateHook<string> {
  const [state, setState] = useAsyncState<string>();

  // Obtener valor almacenado al montar el componente
  useEffect(() => {
    const getStoredValue = async () => {
      try {
        if (Platform.OS === 'web') {
          if (typeof localStorage !== 'undefined') {
            const storedValue = localStorage.getItem(key);
            setState(storedValue);
          }
        } else {
          const storedValue = await SecureStore.getItemAsync(key);
          setState(storedValue);
        }
      } catch (e) {
        console.error('Error fetching storage item:', e);
      }
    };

    getStoredValue();
  }, [key]);

  // Establecer nuevo valor en el almacenamiento
  const setValue = useCallback(
    (value: string | null) => {
      setState(value);
      setStorageItemAsync(key, value);
    },
    [key]
  );

  return [state, setValue];
}
