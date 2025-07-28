import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import CustomButton from '../components/CustomButton'; // Ruta actualizada
import { styles } from '../styles'; // Ruta actualizada

const AuthSelectionScreen = ({ setScreen }) => {
  return (
    <ScrollView contentContainerStyle={styles.scroll_content}>
      <Text style={styles.screen_title}>Bienvenido a YIZER</Text>
      <Text style={styles.subtitle}>Elige una opción para continuar.</Text>

      <CustomButton
        title="Iniciar Sesión"
        onPress={() => setScreen('login')}
        style={styles.auth_selection_button}
      />
      <CustomButton
        title="Registrarse"
        onPress={() => setScreen('register')}
        style={styles.auth_selection_button}
      />
      <CustomButton
        title="Recuperar Contraseña"
        onPress={() => setScreen('recovery')}
        style={styles.auth_selection_button}
      />
      <CustomButton
        title="Volver al Inicio"
        onPress={() => setScreen('home')}
        style={styles.back_button}
      />
    </ScrollView>
  );
};

export default AuthSelectionScreen;
