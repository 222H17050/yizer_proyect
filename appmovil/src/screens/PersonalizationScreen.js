import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert, TextInput } from 'react-native';
import CustomButton from '../components/CustomButton'; // Ruta actualizada
import { styles } from '../styles'; // Ruta actualizada

const PersonalizationScreen = ({
  productos_base,
  selected_producto_base_for_customization,
  setSelected_producto_base_for_customization,
  opciones_personalizacion,
  update_customization,
  handle_confirm_customization,
  posiciones_estampado,
  tamanos_estampado,
  setScreen,
}) => {
  const print_style = {};
  const tamano_estampado_map = {
    'Pequeño': { width: 50, height: 50 },
    'Mediano': { width: 80, height: 80 },
    'Grande': { width: 120, height: 120 },
  };
  const current_print_size = tamano_estampado_map[opciones_personalizacion.tamano] || tamano_estampado_map['Mediano'];

  switch (opciones_personalizacion.posicion) {
    case 'Centro Frontal':
      print_style.alignSelf = 'center';
      print_style.top = '40%';
      break;
    case 'Superior Izquierdo':
      print_style.alignSelf = 'flex-start';
      print_style.top = '10%';
      print_style.left = '10%';
      break;
    case 'Superior Derecho':
      print_style.alignSelf = 'flex-end';
      print_style.top = '10%';
      print_style.right = '10%';
      break;
    case 'Espalda Centro':
      print_style.alignSelf = 'center';
      print_style.top = '40%';
      break;
    default:
      print_style.alignSelf = 'center';
      print_style.top = '40%';
  }

  const get_product_image_color = (color_name) => {
    const color_map = {
      'Rojo': 'B12A2A',
      'Negro': '000000',
      'Blanco': 'FFFFFF',
      'Gris': '808080',
      'Azul': '0000FF',
      'Verde': '008000',
      'Azul Claro': 'ADD8E6',
      'Rosa': 'FFC0CB',
    };
    const hex_color = color_map[color_name] || 'B12A2A';
    const product_name_for_placeholder = selected_producto_base_for_customization ? selected_producto_base_for_customization.nombre.split(' ')[0] : 'Producto';
    return `https://placehold.co/300x300/${hex_color}/FFFFFF?text=${product_name_for_placeholder}`;
  };

  if (!selected_producto_base_for_customization) {
    return (
      <ScrollView contentContainerStyle={styles.scroll_content}>
        <Text style={styles.screen_title}>Elige un Producto para Personalizar</Text>
        <View style={styles.product_grid}>
          {productos_base.map((producto) => (
            <TouchableOpacity
              key={producto.id_producto}
              style={styles.product_card}
              onPress={() => setSelected_producto_base_for_customization(producto)}
            >
              <Image source={{ uri: producto.imagen_url }} style={styles.product_image} />
              <Text style={styles.product_name}>{producto.nombre}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <CustomButton
          title="Volver al Inicio"
          onPress={() => setScreen('home')}
          style={styles.back_button}
        />
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scroll_content}>
      <Text style={styles.screen_title}>Personalizar {selected_producto_base_for_customization.nombre}</Text>
      <Text style={styles.product_detail_model}>{selected_producto_base_for_customization.modelo}</Text>

      <View style={styles.preview_container}>
        <Image
          source={{ uri: get_product_image_color(opciones_personalizacion.color) }}
          style={styles.preview_product_image}
        />
        <Image
          source={{ uri: opciones_personalizacion.imagen_estampado_url }}
          style={[styles.preview_print_image, print_style, current_print_size]}
        />
      </View>

      <View style={styles.customization_options_container}>
        <Text style={styles.option_title}>Talla:</Text>
        <View style={styles.option_row}>
          {selected_producto_base_for_customization.tallas_disponibles.map((talla) => (
            <CustomButton
              key={talla}
              title={talla}
              onPress={() => update_customization('talla', talla)}
              style={[
                styles.option_button,
                opciones_personalizacion.talla === talla && styles.option_button_selected,
              ]}
              text_style={styles.option_button_text}
            />
          ))}
        </View>

        <Text style={styles.option_title}>Color:</Text>
        <View style={styles.option_row}>
          {selected_producto_base_for_customization.colores_disponibles.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.color_swatch,
                { backgroundColor: color.toLowerCase().replace(' ', '') },
                opciones_personalizacion.color === color && styles.color_swatch_selected,
              ]}
              onPress={() => update_customization('color', color)}
            />
          ))}
        </View>

        <Text style={styles.option_title}>Cantidad:</Text>
        <View style={styles.quantity_container}>
          <CustomButton
            title="-"
            onPress={() => update_customization('cantidad', Math.max(1, opciones_personalizacion.cantidad - 1))}
            style={styles.quantity_button}
            text_style={styles.quantity_button_text}
          />
          <Text style={styles.quantity_text}>{opciones_personalizacion.cantidad}</Text>
          <CustomButton
            title="+"
            onPress={() => update_customization('cantidad', opciones_personalizacion.cantidad + 1)}
            style={styles.quantity_button}
            text_style={styles.quantity_button_text}
          />
        </View>

        <Text style={styles.option_title}>Posición del Estampado:</Text>
        <View style={styles.option_row}>
          {posiciones_estampado.map((posicion) => (
            <CustomButton
              key={posicion}
              title={posicion}
              onPress={() => update_customization('posicion', posicion)}
              style={[
                styles.option_button,
                opciones_personalizacion.posicion === posicion && styles.option_button_selected,
              ]}
              text_style={styles.option_button_text}
            />
          ))}
        </View>

        <Text style={styles.option_title}>Tamaño del Estampado:</Text>
        <View style={styles.option_row}>
          {tamanos_estampado.map((tamano) => (
            <CustomButton
              key={tamano}
              title={tamano}
              onPress={() => update_customization('tamano', tamano)}
              style={[
                styles.option_button,
                opciones_personalizacion.tamano === tamano && styles.option_button_selected,
              ]}
              text_style={styles.option_button_text}
            />
          ))}
        </View>

        <Text style={styles.option_title}>Notas de Personalización:</Text>
        <TextInput
          style={styles.input_large}
          placeholder="Ej: 'Quiero el estampado un poco más arriba'"
          placeholderTextColor="#aaa"
          multiline={true}
          numberOfLines={4}
          value={opciones_personalizacion.notas_personalizacion}
          onChangeText={(text) => update_customization('notas_personalizacion', text)}
        />
      </View>

      <CustomButton
        title="Confirmar Producto"
        onPress={handle_confirm_customization}
        style={styles.confirm_customization_button}
      />
      <CustomButton
        title="Modificar Diseño"
        onPress={() => {
          Alert.alert("Modificar Diseño", "Puedes ajustar las opciones de personalización arriba.");
        }}
        style={styles.modify_design_button}
      />
      <CustomButton
        title="Volver a Elegir Producto"
        onPress={() => setSelected_producto_base_for_customization(null)}
        style={styles.back_button}
      />
    </ScrollView>
  );
};

export default PersonalizationScreen;
