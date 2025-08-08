import { Stack } from "expo-router";
import { AuthProvider } from '../authentication/AuthContext';
import DropdownMenu from '../components/DropdownMenu';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="products"
          options={{
            headerShown: true,
            title: 'Tienda',
            headerLeft: () => null,
            headerRight: () => (
              <DropdownMenu />
            ),
            headerStyle: {
              backgroundColor: '#c0392b', // Fondo rojo oscuro para la cabecera
            },
            headerTintColor: '#fff', // Color del texto y los iconos en blanco
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="carrito"
          options={{
            headerShown: true,
            title: 'Carrito',
            headerLeft: () => null,
            headerRight: () => (
              <DropdownMenu />
            ),
            headerStyle: {
              backgroundColor: '#c0392b', // Fondo rojo oscuro para la cabecera
            },
            headerTintColor: '#fff', // Color del texto y los iconos en blanco
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="personalizables"
          options={{
            headerShown: true,
            title: 'Personalizables',
            headerLeft: () => null,
            headerRight: () => (
              <DropdownMenu />
            ),
            headerStyle: {
              backgroundColor: '#c0392b', // Fondo rojo oscuro para la cabecera
            },
            headerTintColor: '#fff', // Color del texto y los iconos en blanco
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="register"
          options={{
            headerShown: true,
            title: 'Registro',
            headerStyle: {
              backgroundColor: '#c0392b', // Fondo rojo oscuro para la cabecera
            },
            headerTintColor: '#fff', // Color del texto y los iconos en blanco
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="[productId]"
          options={{
            headerShown: true,
            headerStyle: {
              backgroundColor: '#c0392b', // Fondo rojo oscuro para la cabecera
            },
            headerTintColor: '#fff', // Color del texto y los iconos en blanco
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
      </Stack>
    </AuthProvider>
  );
}