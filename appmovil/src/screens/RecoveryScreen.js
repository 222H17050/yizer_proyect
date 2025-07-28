import React from 'react';
import { View, Text, ScrollView, TextInput, Alert } from 'react-native';
import CustomButton from '../components/CustomButton'; // Ruta actualizada
import { styles } from '../styles'; // Ruta actualizada

const RecoveryScreen = ({ setScreen }) => {
  return (
    <ScrollView contentContainerStyle={styles.scroll_content}>
      <Text style={styles.screen_title}>Recuperar Contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#aaa"
      />
      <CustomButton
        title="Enviar Contraseña"
        onPress={() => {
          Alert.alert("Recuperación", "Se ha enviado un enlace de recuperación a tu correo.");
          setScreen('login');
        }}
        style={styles.auth_button}
      />
      <CustomButton
        title="Volver"
        onPress={() => setScreen('authSelection')}
        style={styles.back_button}
      />
    </ScrollView>
  );
};

export default RecoveryScreen;
