import React from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import CustomButton from '../components/CustomButton'; // Ruta actualizada
import { styles } from '../styles'; // Ruta actualizada

const LoginScreen = ({ setScreen }) => {
  return (
    <ScrollView contentContainerStyle={styles.scroll_content}>
      <Text style={styles.screen_title}>Iniciar Sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        placeholderTextColor="#aaa"
      />
      <CustomButton
        title="Entrar"
        onPress={() => {
          Alert.alert("Inicio de Sesión", "Funcionalidad de inicio de sesión simulada.");
          setScreen('home');
        }}
        style={styles.auth_button}
      />
      <TouchableOpacity onPress={() => setScreen('recovery')}>
        <Text style={styles.link_text}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>
      <CustomButton
        title="Volver"
        onPress={() => setScreen('authSelection')}
        style={styles.back_button}
      />
    </ScrollView>
  );
};

export default LoginScreen;
