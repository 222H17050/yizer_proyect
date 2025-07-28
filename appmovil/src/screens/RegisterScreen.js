import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Alert } from 'react-native';
import CustomButton from '../components/CustomButton'; // Ruta actualizada
import { styles } from '../styles'; // Ruta actualizada

const RegisterScreen = ({ setScreen }) => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccionTexto, setDireccionTexto] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [codigoPostal, setCodigoPostal] = useState('');
  const [referencias, setReferencias] = useState('');

  const handleRegister = () => {
    if (contrasena !== confirmarContrasena) {
      Alert.alert("Error de Registro", "Las contraseñas no coinciden.");
      return;
    }
    Alert.alert(
      "Registro Exitoso (Simulado)",
      `Usuario: ${nombre}\nCorreo: ${correo}\nTeléfono: ${telefono}\nDirección: ${direccionTexto}, ${municipio}, CP: ${codigoPostal}\nReferencias: ${referencias}`
    );
    setScreen('home');
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll_content}>
      <Text style={styles.screen_title}>Registrarse</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre de usuario"
        placeholderTextColor="#aaa"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#aaa"
        value={correo}
        onChangeText={setCorreo}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        placeholderTextColor="#aaa"
        value={contrasena}
        onChangeText={setContrasena}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar Contraseña"
        secureTextEntry
        placeholderTextColor="#aaa"
        value={confirmarContrasena}
        onChangeText={setConfirmarContrasena}
      />
      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        keyboardType="phone-pad"
        placeholderTextColor="#aaa"
        value={telefono}
        onChangeText={setTelefono}
      />
      <TextInput
        style={styles.input_large}
        placeholder="Dirección (Calle, Número, Colonia)"
        placeholderTextColor="#aaa"
        multiline={true}
        numberOfLines={2}
        value={direccionTexto}
        onChangeText={setDireccionTexto}
      />
      <TextInput
        style={styles.input}
        placeholder="Municipio"
        placeholderTextColor="#aaa"
        value={municipio}
        onChangeText={setMunicipio}
      />
      <TextInput
        style={styles.input}
        placeholder="Código Postal"
        keyboardType="numeric"
        placeholderTextColor="#aaa"
        value={codigoPostal}
        onChangeText={setCodigoPostal}
      />
      <TextInput
        style={styles.input_large}
        placeholder="Referencias (Ej: 'Casa azul con portón negro')"
        placeholderTextColor="#aaa"
        multiline={true}
        numberOfLines={3}
        value={referencias}
        onChangeText={setReferencias}
      />
      <CustomButton
        title="Registrar"
        onPress={handleRegister}
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

export default RegisterScreen;
