import { createContext, useContext, type PropsWithChildren, useState, useEffect } from "react";
import { setStorageItemAsync, useStorageState } from '@/hooks/useStorageState'; 
import useAxios from "@/hooks/useAxios";

interface UserProfile {
  id: number;
  last_login: Date | string | null;
  is_superuser: boolean;
  email: string;
  first_name: string;
  last_name: string;
  img_profile: string;
  phone_number: string;
  is_active: boolean;
  is_staff: boolean;
  preferred_activities: number[];
}

interface AuthContextValue {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  session?: string | null;
  userProfile?: UserProfile | null;
  isLoading: boolean;
  fetchUserProfile: (token: string) => Promise<void>;
  error?: string | null;
}

const AuthContext = createContext<AuthContextValue>({
  signIn: () => Promise.resolve(),
  signOut: () => null,
  session: null,
  userProfile: null,
  fetchUserProfile: () => Promise.resolve(),
  isLoading: false,
});

export function useSession() {
  return useContext(AuthContext);
}

export function SessionProvider({ children }: PropsWithChildren) {
  const { post, get } = useAxios();
  const [[isLoading, session], setSession] = useStorageState('session'); 
  const [storedUserProfile, setStoredUserProfile] = useStorageState('userProfile');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(
    storedUserProfile && storedUserProfile[1] ? JSON.parse(storedUserProfile[1]) : null
  );
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = async (token: string) => {
    try {
      setStoredUserProfile(null);
      const { data } = await get('/auth/users/me/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserProfile(data);
      setStoredUserProfile(JSON.stringify(data)); 
    } catch (error) {
      setError("No se pudo obtener el perfil del usuario");
      setStoredUserProfile(null); 
    }
  }

  const signIn = async (email: string, password: string) => {
    setError(null);
    try {
      const { data } = await post('/auth/jwt/create/', { email, password });
      const token = data.access;
      setSession(token); 
      await fetchUserProfile(token);
    } catch (error: any) {
      if (error.response?.status === 401) {
        setError('Email o contraseña incorrectos');
        return;
      }
      throw error;
    }
  };

  const signOut = async () => {
    setSession(null); 
    setUserProfile(null);
    setStoredUserProfile(null); 
    setError(null);

    await setStorageItemAsync('session', null);
    await setStorageItemAsync('userProfile', null);

    setSession(null); 
    setUserProfile(null);
    setStoredUserProfile(null); 
    setError(null);
    
  };

  useEffect(() => {
    if (session && !userProfile) {
      fetchUserProfile(session);
    }
  }, [session]);

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        session,
        userProfile,
        isLoading,
        fetchUserProfile,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
