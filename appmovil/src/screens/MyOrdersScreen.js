import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native';
import CustomButton from '../components/CustomButton'; // Ruta actualizada
import { styles } from '../styles'; // Ruta actualizada

const MyOrdersScreen = ({
  current_items_pedido,
  historial_pedidos,
  remove_from_cart,
  get_total_cart_price,
  handle_purchase,
  notas_pedido_actual,
  setNotas_pedido_actual,
  setScreen,
}) => {
  return (
    <ScrollView contentContainerStyle={styles.scroll_content}>
      <Text style={styles.screen_title}>Mi Compra</Text>

      {/* Ítems del Carrito Actual (Pendientes de Confirmar) */}
      {current_items_pedido.length > 0 && (
        <View style={styles.current_cart_section}>
          <Text style={styles.section_title}>Productos Pendientes de Confirmar:</Text>
          {current_items_pedido.map((item, index) => (
            <View key={`${item.id_item}-${index}-current`} style={styles.cart_item}>
              <Image source={{ uri: item.imagen_url_producto }} style={styles.cart_item_image} />
              <View style={styles.cart_item_details}>
                <Text style={styles.cart_item_name}>{item.nombre_producto}</Text>
                {item.modelo_producto && <Text style={styles.cart_item_customization}>Modelo: {item.modelo_producto}</Text>}
                {item.personalizacion_detalle && (
                  <View>
                    <Text style={styles.cart_item_customization}>Talla: {item.variante_seleccionada.talla}</Text>
                    <Text style={styles.cart_item_customization}>Color: {item.variante_seleccionada.color}</Text>
                    <Text style={styles.cart_item_customization}>Estampado: {item.personalizacion_detalle.posicion} ({item.personalizacion_detalle.tamano})</Text>
                    {item.personalizacion_detalle.notas && <Text style={styles.cart_item_customization}>Notas: {item.personalizacion_detalle.notas}</Text>}
                    {item.personalizacion_detalle.precio_extra !== '0.00' && (
                      <Text style={styles.cart_item_customization}>Extra Personalización: ${item.personalizacion_detalle.precio_extra}</Text>
                    )}
                  </View>
                )}
                <Text style={styles.cart_item_price}>${item.precio_unitario} x {item.cantidad}</Text>
                <Text style={styles.cart_item_price}>Total: ${(parseFloat(item.precio_unitario) + parseFloat(item.personalizacion_detalle?.precio_extra || '0.00')) * item.cantidad}</Text>
              </View>
              <CustomButton
                title="Eliminar"
                onPress={() => remove_from_cart(item)}
                style={styles.remove_button}
                text_style={styles.remove_button_text}
              />
            </View>
          ))}
          <Text style={styles.total_price}>Total Pendiente: ${get_total_cart_price().toFixed(2)}</Text>

          <Text style={styles.option_title}>Notas del Pedido:</Text>
          <TextInput
            style={styles.input_large}
            placeholder="Ej: 'Dejar en portería, avisar al llegar'"
            placeholderTextColor="#aaa"
            multiline={true}
            numberOfLines={4}
            value={notas_pedido_actual}
            onChangeText={setNotas_pedido_actual}
          />

          <CustomButton
            title="Confirmar Compra"
            onPress={handle_purchase}
            style={styles.confirm_purchase_button}
          />
        </View>
      )}

      {/* Pedidos Anteriores (Historial) */}
      <Text style={styles.section_title}>Mis Pedidos Anteriores:</Text>
      {historial_pedidos.length === 0 ? (
        <Text style={styles.empty_cart_text}>No has realizado ningún pedido aún.</Text>
      ) : (
        historial_pedidos.map((pedido, pedido_index) => (
          <View key={pedido.id_pedido} style={styles.order_card}>
            <Text style={styles.order_id}>Pedido #{pedido.id_pedido}</Text>
            <Text style={styles.order_info}>Fecha del Pedido: {new Date(pedido.fecha_pedido).toLocaleDateString('es-ES')}</Text>
            <Text style={styles.order_info}>Estado: <Text style={styles.order_status}>{pedido.estado_pedido}</Text></Text>
            <Text style={styles.order_info}>Entrega Estimada: {new Date(pedido.fecha_entrega).toLocaleDateString('es-ES')}</Text>
            {pedido.notas && <Text style={styles.order_info}>Notas: {pedido.notas}</Text>}
            <Text style={styles.order_total}>Total: ${pedido.pago_detalle.total}</Text>
            <View style={styles.order_items_container}>
              {pedido.items_pedido.map((item, item_index) => (
                <View key={`${item.id_item}-${item_index}-order-item`} style={styles.order_item}>
                  <Image source={{ uri: item.imagen_url_producto }} style={styles.order_item_image} />
                  <View style={styles.order_item_details}>
                    <Text style={styles.order_item_name}>{item.nombre_producto}</Text>
                    {item.modelo_producto && <Text style={styles.order_item_customization}>Modelo: {item.modelo_producto}</Text>}
                    {item.personalizacion_detalle && (
                      <View>
                        <Text style={styles.order_item_customization}>Talla: {item.variante_seleccionada.talla}</Text>
                        <Text style={styles.cart_item_customization}>Color: {item.variante_seleccionada.color}</Text>
                        <Text style={styles.order_item_customization}>Estampado: {item.personalizacion_detalle.posicion} ({item.personalizacion_detalle.tamano})</Text>
                        {item.personalizacion_detalle.notas && <Text style={styles.order_item_customization}>Notas: {item.personalizacion_detalle.notas}</Text>}
                        {item.personalizacion_detalle.precio_extra !== '0.00' && (
                          <Text style={styles.order_item_customization}>Extra Personalización: ${item.personalizacion_detalle.precio_extra}</Text>
                        )}
                      </View>
                    )}
                    <Text style={styles.order_item_price}>${item.precio_unitario} x {item.cantidad}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))
      )}
      <CustomButton
        title="Seguir Comprando"
        onPress={() => setScreen('home')}
        style={styles.back_button}
      />
    </ScrollView>
  );
};

export default MyOrdersScreen;
