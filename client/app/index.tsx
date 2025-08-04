import { Text, View, StyleSheet, Button  } from "react-native";

import { Link } from "expo-router"; // Importa Link de Expo Router

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Home Screen</Text>
      {/* Usa Link para navegar */}
      <Link href="/profile" asChild>
        <Button title="Ver Productos" />
      </Link>
      <Link href="/login" asChild>
        <Button title="Iniciar sesion" />
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
});
