import React, { useState } from 'react';
import { useAuth } from '../authentication/AuthContext';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

// Importa la función verifyClient de tu API
import { verifyClient } from '../api/client';
import { Link, useRouter } from "expo-router";


export default function LoginScreen() {
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [loading, setLoading] = useState(false);

  // Expo Router
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!correo || !contraseña) {
      Alert.alert('Error', 'Por favor, ingresa tu correo y contraseña.');
      return;
    }

    setLoading(true);
    try {
      // Llama a la función verifyClient con los credenciales del usuario
      const response = await verifyClient({ correo, contraseña });

      // Ahora la respuesta está tipada como ApiResponse<ClientData>
      if (response.success) {
        Alert.alert('Éxito', response.message);
        console.log('Datos del cliente autenticado:', response.data);
        if (response.data) {
          await login(response.data);
          router.replace('/products');
        } else {
          Alert.alert('Error', 'No se recibieron datos del cliente');
        }
      } else {
        Alert.alert('Error de autenticación', response.message || 'Credenciales inválidas.');
      }
    } catch (error: any) {
      console.error('Error durante el inicio de sesión:', error);
      // Estos errores son si la *llamada a la API* falló (red, servidor no responde, etc.)
      if (error.response) {
        // Error de respuesta del servidor HTTP (ej. 400, 401, 500)
        Alert.alert('Error del servidor', error.response.data?.message || 'Hubo un problema con el servidor.');
      } else if (error.request) {
        // La solicitud fue hecha pero no se recibió respuesta (problemas de red)
        Alert.alert('Error de red', 'No se pudo conectar con el servidor. Verifica tu conexión a internet o la IP del servidor.');
      } else {
        // Otros errores inesperados
        Alert.alert('Error', 'Ocurrió un error inesperado. Inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Text style={styles.yizer}>YIZER</Text>
      <View style={styles.content}>
        <Text style={styles.title}>Iniciar Sesión</Text>

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          value={correo}
          onChangeText={setCorreo}
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#999"
          secureTextEntry
          value={contraseña}
          onChangeText={setContraseña}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <Text style={styles.buttonText}>Cargando...</Text>
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>

        <Link href="/register" asChild>
          <Text style={styles.loginText}>¿No tienes cuenta? Registrarse</Text>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({

  yizer: {
    fontSize: 45,
    fontStyle: 'italic',
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#1e90ff',
  },

  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerText: {
    color: '#007bff',
    fontSize: 15,
    marginTop: 10,
  },
  loginText: {
    color: '#007bff',
    fontSize: 15,
    marginTop: 10,
  },
});