import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import CustomButton from '../components/CustomButton'; // Ruta actualizada
import { styles } from '../styles'; // Ruta actualizada

const HomeScreen = ({ productos_base, setScreen, setSelected_producto }) => {
  return (
    <ScrollView contentContainerStyle={styles.scroll_content}>
      <Text style={styles.title}>YIZER</Text>
      <Text style={styles.subtitle}>Personaliza tu mundo con estilo.</Text>

      <CustomButton
        title="Iniciar Sesión"
        onPress={() => setScreen('authSelection')}
        style={styles.hero_button}
      />
      <CustomButton
        title="Registrarse"
        onPress={() => setScreen('authSelection')}
        style={styles.hero_button}
      />

      <View style={styles.product_grid}>
        {productos_base.map((producto) => (
          <TouchableOpacity
            key={producto.id_producto}
            style={styles.product_card}
            onPress={() => {
              setSelected_producto(producto);
              setScreen('product');
            }}
          >
            <Image source={{ uri: producto.imagen_url }} style={styles.product_image} />
            <Text style={styles.product_name}>{producto.nombre}</Text>
            <Text style={styles.product_price}>${producto.precio_base}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
