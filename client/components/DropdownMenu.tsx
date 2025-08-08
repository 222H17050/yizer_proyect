import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../authentication/AuthContext';
import { useRouter, usePathname } from 'expo-router'; // <--- Importa usePathname

const DropdownMenu = () => {
    const router = useRouter();
    const pathname = usePathname(); // <--- Obtiene la ruta actual
    const [menuVisible, setMenuVisible] = useState(false);
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        setMenuVisible(false); // Cierra el menú antes de desloguear
        await logout();
        Alert.alert('Sesión cerrada', 'Has cerrado la sesión correctamente.');
    };

    return (
        <View style={styles.menuContainer}>
            <TouchableOpacity
                onPress={() => setMenuVisible(!menuVisible)}
                style={styles.menuButton}
            >
                <Text style={styles.menuButtonText}>{user?.nombre || 'Menú'}</Text>
            </TouchableOpacity>

            {menuVisible && (
                <View style={styles.dropdown}>
                    {/* Condicional para 'Mi perfil' */}
                    {pathname !== '/' && (
                        <TouchableOpacity style={styles.dropdownItem} onPress={() => {
                            setMenuVisible(false);
                            router.push('/');
                        }}>
                            <Text style={styles.itemText}>Mi perfil</Text>
                        </TouchableOpacity>
                    )}

                    {/* Condicional para 'Carrito' */}
                    {pathname !== '/carrito' && (
                        <TouchableOpacity style={styles.dropdownItem} onPress={() => {
                            setMenuVisible(false);
                            router.push('/carrito');
                        }}>
                            <Text style={styles.itemText}>Carrito</Text>
                        </TouchableOpacity>
                    )}

                    {/* Condicional para 'Personalizables' */}
                    {pathname !== '/personalizables' && (
                        <TouchableOpacity style={styles.dropdownItem} onPress={() => {
                            setMenuVisible(false);
                            router.push('/personalizables');
                        }}>
                            <Text style={styles.itemText}>Personalizables</Text>
                        </TouchableOpacity>
                    )}

                    {/* Condicional para 'Productos' */}
                    {pathname !== '/products' && (
                        <TouchableOpacity style={styles.dropdownItem} onPress={() => {
                            setMenuVisible(false);
                            router.push('/products');
                        }}>
                            <Text style={styles.itemText}>Tienda</Text>
                        </TouchableOpacity>
                    )}

                    {/* La opción de cerrar sesión siempre se muestra */}
                    <TouchableOpacity style={styles.dropdownItem} onPress={() => {
                        setMenuVisible(false);
                        handleLogout();
                        router.push('/');
                    }}>
                        <Text style={[styles.itemText, { color: 'red' }]}>Cerrar Sesión</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    menuContainer: {
        position: 'relative',
        marginRight: 10,
    },
    menuButton: {
        padding: 8,
        backgroundColor: 'white', // Rojo oscuro para el botón
        borderRadius: 5,
        shadowColor: '#a00',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    menuButtonText: {
        color: '#c0392b',
        fontWeight: 'bold',
    },
    dropdown: {
        position: 'absolute',
        top: 45,
        right: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        elevation: 3,
        shadowColor: '#a00', // Sombra roja
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        width: 150,
        zIndex: 10,
    },
    dropdownItem: {
        padding: 15,
        borderBottomColor: '#ffdbd9', // Un tono de rojo muy claro para el separador
        borderBottomWidth: 1,
    },
    itemText: {
        fontSize: 16,
        color: 'black', // Texto en un tono de rojo oscuro
    },
});

export default DropdownMenu;
