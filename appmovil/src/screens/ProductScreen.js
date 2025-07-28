import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import CustomButton from '../components/CustomButton'; // Ruta actualizada
import { styles } from '../styles'; // Ruta actualizada

const ProductScreen = ({ selected_producto, setScreen, add_to_cart }) => {
  return (
    <ScrollView contentContainerStyle={styles.scroll_content}>
      {selected_producto && (
        <View style={styles.product_detail_container}>
          <Image source={{ uri: selected_producto.imagen_url }} style={styles.product_detail_image} />
          <Text style={styles.product_detail_name}>{selected_producto.nombre}</Text>
          <Text style={styles.product_detail_model}>{selected_producto.modelo}</Text>
          <Text style={styles.product_detail_price}>${selected_producto.precio_base}</Text>
          <Text style={styles.product_detail_description}>{selected_producto.descripcion}</Text>

          <CustomButton
            title="Añadir al Carrito"
            onPress={() => {
              add_to_cart({
                id_item: `ITEM-${Date.now()}`,
                id_producto: selected_producto.id_producto,
                nombre_producto: selected_producto.nombre,
                modelo_producto: selected_producto.modelo,
                imagen_url_producto: selected_producto.imagen_url,
                precio_unitario: selected_producto.precio_base,
                cantidad: 1,
                estado_item: 'pendiente',
                personalizacion_detalle: null,
                variante_seleccionada: {
                  id_variante: `VAR-DEFAULT-${selected_producto.id_producto}`,
                  talla: selected_producto.tallas_disponibles[0] || 'M',
                  color: selected_producto.colores_disponibles[0] || 'Blanco',
                  stock: 999
                }
              });
            }}
            style={styles.add_to_cart_button}
          />
          <CustomButton
            title="Volver"
            onPress={() => setScreen('home')}
            style={styles.back_button}
          />
        </View>
      )}
    </ScrollView>
  );
};

export default ProductScreen;
