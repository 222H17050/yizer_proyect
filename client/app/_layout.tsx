import { Stack } from "expo-router";
import { AuthProvider } from '../authentication/AuthContext'
import DropdownMenu from '../components/DropdownMenu'; 



export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false, // ← Oculta el header para esta pantalla
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
          }}
        />
      </Stack>
    </AuthProvider>
  );
}