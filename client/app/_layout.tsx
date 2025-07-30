import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: true, // ← Oculta el header para esta pantalla
        }} 
      />
    </Stack>
  );
}