import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ClientData, ApiResponse } from '../api/client'; // Importa la interfaz desde tu archivo client.ts

// Creamos un tipo para nuestro contexto de autenticación
interface AuthContextType {
  user: ClientData | null;
  isLoading: boolean;
  login: (userData: ClientData) => Promise<void>;
  logout: () => Promise<void>;
}

// Creamos el contexto. Inicialmente, el valor es null.
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<ClientData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // useEffect para cargar los datos del usuario al iniciar la app
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user_data');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (e) {
        console.error('Error al cargar los datos del usuario del almacenamiento local', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadUserData();
  }, []);

  const login = async (userData: ClientData) => {
    setUser(userData);
    await AsyncStorage.setItem('user_data', JSON.stringify(userData));
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('user_data');
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Un hook personalizado para usar el contexto de forma sencilla
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};