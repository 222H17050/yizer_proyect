import React, { useState } from 'react';
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
import { Link, useRouter } from "expo-router";
import { createClient } from '../api/client';

export default function RegisterScreen() {
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [telefono, setTelefono] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleRegister = async () => {
        if (!nombre || !correo || !telefono || !contraseña) {
            Alert.alert('Error', 'Por favor, completa todos los campos.');
            return;
        }

        setLoading(true);
        try {
            const response = await createClient({
              nombre,
              correo,
              telefono,
              contraseña
            });

            if (response.success) {
                Alert.alert('Éxito', 'Registro completado correctamente');
                router.replace('/'); // Redirige al login después del registro
            } else {
                Alert.alert('Error', response.message || 'Error al registrar el usuario');
            }
        } catch (error: any) {
            console.error('Error durante el registro:', error);
            if (error.response) {
                Alert.alert('Error del servidor', error.response.data?.message || 'Hubo un problema con el servidor.');
            } else if (error.request) {
                Alert.alert('Error de red', 'No se pudo conectar con el servidor. Verifica tu conexión a internet.');
            } else {
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
            <View style={styles.content}>
                <Text style={styles.title}>Registro</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Nombre completo"
                    placeholderTextColor="#999"
                    value={nombre}
                    onChangeText={setNombre}
                />

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
                    placeholder="Teléfono"
                    placeholderTextColor="#999"
                    keyboardType="phone-pad"
                    value={telefono}
                    onChangeText={setTelefono}
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
                    onPress={handleRegister}
                    disabled={loading}
                >
                    {loading ? (
                        <Text style={styles.buttonText}>Cargando...</Text>
                    ) : (
                        <Text style={styles.buttonText}>Registrarse</Text>
                    )}
                </TouchableOpacity>

                <Link href="/" asChild>
                    <Text style={styles.loginText}>¿Ya tienes cuenta? Iniciar Sesión</Text>
                </Link>
            </View>
        </KeyboardAvoidingView>
    );
}

// Reutilizamos los mismos estilos del login para mantener consistencia
const styles = StyleSheet.create({
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
    loginText: {
        color: '#007bff',
        fontSize: 15,
        marginTop: 10,
    },
});