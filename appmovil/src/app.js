import React, { useState, useEffect } from 'react';
import { View, Modal, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Importaciones de componentes (rutas actualizadas)
import Header from './components/Header';
import SideMenu from './components/SideMenu';
import SuccessModal from './components/SuccessModal';

// Importaciones de pantallas (rutas actualizadas)
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import PersonalizationScreen from './screens/PersonalizationScreen';
import MyOrdersScreen from './screens/MyOrdersScreen';
import AuthSelectionScreen from './screens/AuthSelectionScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import RecoveryScreen from './screens/RecoveryScreen';

// Importaciones de constantes (rutas actualizadas)
import { productos_base, posiciones_estampado, tamanos_estampado } from './api/data';
import { styles } from './styles'; // styles.js ahora está directamente en src/

const App = () => {
  const [screen, setScreen] = useState('home');
  const [selected_producto, setSelected_producto] = useState(null);
  const [current_items_pedido, setCurrent_items_pedido] = useState([]);
  const [historial_pedidos, setHistorial_pedidos] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [selected_producto_base_for_customization, setSelected_producto_base_for_customization] = useState(null);
  const [opciones_personalizacion, setOpciones_personalizacion] = useState({
    talla: 'M',
    color: 'Blanco',
    cantidad: 1,
    posicion: 'Centro Frontal',
    tamano: 'Mediano',
    notas_personalizacion: '',
    precio_extra_personalizacion: '0.00',
    imagen_estampado_url: 'https://placehold.co/100x100/FFD700/000?text=Estampado'
  });

  const [notas_pedido_actual, setNotas_pedido_actual] = useState('');

  useEffect(() => {
    if (selected_producto_base_for_customization) {
      setOpciones_personalizacion({
        talla: selected_producto_base_for_customization.tallas_disponibles[0] || 'M',
        color: selected_producto_base_for_customization.colores_disponibles[0] || 'Blanco',
        cantidad: 1,
        posicion: posiciones_estampado[0],
        tamano: tamanos_estampado[0],
        notas_personalizacion: '',
        precio_extra_personalizacion: '0.00',
        imagen_estampado_url: 'https://placehold.co/100x100/FFD700/000?text=Estampado'
      });
    }
  }, [selected_producto_base_for_customization]);

  const add_to_cart = (item_to_add) => {
    setCurrent_items_pedido((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) =>
          item.id_producto === item_to_add.id_producto &&
          item.personalizacion_detalle?.posicion === item_to_add.personalizacion_detalle?.posicion &&
          item.personalizacion_detalle?.tamano === item_to_add.personalizacion_detalle?.tamano &&
          item.variante_seleccionada?.talla === item_to_add.variante_seleccionada?.talla &&
          item.variante_seleccionada?.color === item_to_add.variante_seleccionada?.color
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].cantidad += item_to_add.cantidad;
        return updatedItems;
      }
      return [...prevItems, item_to_add];
    });
    setScreen('myOrders');
  };

  const remove_from_cart = (item_to_remove) => {
    setCurrent_items_pedido((prevItems) =>
      prevItems.filter(
        (item) =>
          !(
            item.id_producto === item_to_remove.id_producto &&
            item.personalizacion_detalle?.posicion === item_to_remove.personalizacion_detalle?.posicion &&
            item.personalizacion_detalle?.tamano === item_to_remove.personalizacion_detalle?.tamano &&
            item.variante_seleccionada?.talla === item_to_remove.variante_seleccionada?.talla &&
            item.variante_seleccionada?.color === item_to_remove.variante_seleccionada?.color
          )
      )
    );
  };

  const get_total_cart_price = () => {
    return current_items_pedido.reduce((total, item) => {
      const precio_base_item = parseFloat(item.precio_unitario || item.precio_base);
      const precio_extra_personalizacion = parseFloat(item.personalizacion_detalle?.precio_extra || '0.00');
      return total + (precio_base_item + precio_extra_personalizacion) * item.cantidad;
    }, 0);
  };

  const handle_purchase = () => {
    if (current_items_pedido.length === 0) {
      Alert.alert("Carrito Vacío", "No hay productos en el carrito para confirmar la compra.");
      return;
    }

    const nuevo_pedido = {
      id_pedido: `ORD-${Date.now()}`,
      fecha_pedido: new Date().toISOString(),
      fecha_entrega: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      notas: notas_pedido_actual,
      id_cliente: 'cliente_simulado_123',
      pago_detalle: {
        id_pago: `PAG-${Date.now()}`,
        subtotal: get_total_cart_price().toFixed(2),
        costo_envio: '0.00',
        total: get_total_cart_price().toFixed(2),
      },
      id_direccion: 'direccion_simulada_456',
      items_pedido: [...current_items_pedido.map(item => ({
        ...item,
        estado_item: 'Confirmado'
      }))],
      estado_pedido: 'Confirmado',
    };

    setHistorial_pedidos((prevOrders) => [...prevOrders, nuevo_pedido]);
    setCurrent_items_pedido([]);
    setNotas_pedido_actual('');
    setShowSuccessModal(true);
  };

  const handle_close_success_modal = () => {
    setShowSuccessModal(false);
    setScreen('myOrders');
  };

  const update_customization = (key, value) => {
    setOpciones_personalizacion((prev) => ({ ...prev, [key]: value }));
  };

  const handle_confirm_customization = () => {
    if (!selected_producto_base_for_customization) return;

    const customized_item_pedido = {
      id_item: `ITEM-${Date.now()}`,
      id_producto: selected_producto_base_for_customization.id_producto,
      nombre_producto: selected_producto_base_for_customization.nombre,
      modelo_producto: selected_producto_base_for_customization.modelo,
      imagen_url_producto: selected_producto_base_for_customization.imagen_url,
      precio_unitario: selected_producto_base_for_customization.precio_base,
      cantidad: opciones_personalizacion.cantidad,
      estado_item: 'pendiente',
      personalizacion_detalle: {
        id_persinalizacion: `PERS-${Date.now()}`,
        posicion: opciones_personalizacion.posicion,
        tamano: opciones_personalizacion.tamano,
        notas: opciones_personalizacion.notas_personalizacion,
        precio_extra: opciones_personalizacion.precio_extra_personalizacion,
        imagen_estampado_url: opciones_personalizacion.imagen_estampado_url,
      },
      variante_seleccionada: {
        id_variante: `VAR-${Date.now()}`,
        talla: opciones_personalizacion.talla,
        color: opciones_personalizacion.color,
        stock: 999,
      },
    };
    add_to_cart(customized_item_pedido);
    setSelected_producto_base_for_customization(null);
  };

  return (
    <SafeAreaView style={styles.safe_area}>
      <Header onMenuPress={() => setIsMenuOpen(true)} />

      {screen === 'home' && (
        <HomeScreen
          productos_base={productos_base}
          setScreen={setScreen}
          setSelected_producto={setSelected_producto}
        />
      )}
      {screen === 'product' && (
        <ProductScreen
          selected_producto={selected_producto}
          setScreen={setScreen}
          add_to_cart={add_to_cart}
        />
      )}
      {screen === 'myOrders' && (
        <MyOrdersScreen
          current_items_pedido={current_items_pedido}
          historial_pedidos={historial_pedidos}
          remove_from_cart={remove_from_cart}
          get_total_cart_price={get_total_cart_price}
          handle_purchase={handle_purchase}
          notas_pedido_actual={notas_pedido_actual}
          setNotas_pedido_actual={setNotas_pedido_actual}
          setScreen={setScreen}
        />
      )}
      {screen === 'personalization' && (
        <PersonalizationScreen
          productos_base={productos_base}
          selected_producto_base_for_customization={selected_producto_base_for_customization}
          setSelected_producto_base_for_customization={setSelected_producto_base_for_customization}
          opciones_personalizacion={opciones_personalizacion}
          update_customization={update_customization}
          handle_confirm_customization={handle_confirm_customization}
          posiciones_estampado={posiciones_estampado}
          tamanos_estampado={tamanos_estampado}
          setScreen={setScreen}
        />
      )}
      {screen === 'authSelection' && (
        <AuthSelectionScreen
          setScreen={setScreen}
        />
      )}
      {screen === 'login' && (
        <LoginScreen
          setScreen={setScreen}
        />
      )}
      {screen === 'register' && (
        <RegisterScreen
          setScreen={setScreen}
        />
      )}
      {screen === 'recovery' && (
        <RecoveryScreen
          setScreen={setScreen}
        />
      )}

      <SideMenu
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        setScreen={setScreen}
      />

      <SuccessModal
        showSuccessModal={showSuccessModal}
        handleCloseSuccessModal={handle_close_success_modal}
      />
    </SafeAreaView>
  );
};

export default App;
