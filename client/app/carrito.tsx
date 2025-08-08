import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, Image, Dimensions, Button } from 'react-native'; // Añadido Button
import { getCartByClient, ApiResponse } from '../api/client';
import { useAuth } from '../authentication/AuthContext';

// Obtener el ancho de la pantalla para calcular el tamaño de las columnas
const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 48) / 2; // Ancho de la pantalla - padding total (16*2) - margen entre items (8*2) / 2 columnas

// Interfaz para un solo ítem en el carrito que devuelve la API
export interface CartItem {
  cantidad: number;
  costo_total: string;
  nombre_producto: string;
  precio_unitario: string;
  estado: string;
  detalles_posicion?: string | null;
  detalles_tamano?: string | null;
  detalles_notas?: string | null;
  detalles_precio_extra?: string | null;
  id_producto: string;
  imagen_url: string; // Confirmado que el backend la envía
}

// Componente funcional Carrito
const CarritoScreen = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCart = async () => {
      if (authLoading) {
        return;
      }

      if (!user || !user.id_cliente) {
        setError('No se pudo obtener el ID del cliente. Por favor, inicia sesión.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response: ApiResponse<CartItem[]> = await getCartByClient(user.id_cliente);

        // console.log('Respuesta completa de la API para el carrito:', JSON.stringify(response, null, 2)); // Eliminado console.log de depuración

        if (response.success && response.data) {
          setCartItems(response.data);
        } else {
          setError(response.message || 'Error al cargar el carrito.');
        }
      } catch (err: any) {
        console.error('Error al obtener el carrito:', err);
        setError('Ocurrió un error al cargar el carrito. Inténtalo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user, authLoading]);

  if (loading || authLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando carrito...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Reintentar" onPress={() => {
          setLoading(true);
          setError(null);
        }} />
      </View>
    );
  }

  if (cartItems.length === 0) {
    return (
      <View style={styles.centeredContainer}>
        <Text>Tu carrito está vacío.</Text>
      </View>
    );
  }

  const handlePayPress = (item: CartItem) => {
    Alert.alert(
      "Confirmar Pago",
      `¿Deseas pagar por ${item.nombre_producto} - Cantidad: ${item.cantidad} por $${parseFloat(item.costo_total).toFixed(2)}?`,
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Pagar",
          onPress: () => Alert.alert("Pago Realizado", `Pago por ${item.nombre_producto} procesado. (Esta es una simulación)`),
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: CartItem }) => {

    const imageUrl = item.imagen_url ? `http://localhost:4000${item.imagen_url}` : null;

    return (
      <View style={styles.cartItemContainer}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.productImage}
            onError={(e) => console.log('Error al cargar imagen:', imageUrl, e.nativeEvent.error)}
          />
        ) : (
          <View style={styles.noImagePlaceholder}>
            <Text style={styles.noImageText}>Sin Imagen</Text>
          </View>
        )}
        <Text style={styles.productName}>{item.nombre_producto}</Text>
        <Text style={styles.itemDetail}>Cantidad: {item.cantidad}</Text>
        <Text style={styles.itemDetail}>Precio Unitario: ${parseFloat(item.precio_unitario).toFixed(2)}</Text>
        <Text style={styles.totalCost}>Total: ${parseFloat(item.costo_total).toFixed(2)}</Text>
        {item.detalles_posicion && <Text style={styles.itemDetail}>Posición: {item.detalles_posicion}</Text>}
        {item.detalles_tamano && <Text style={styles.itemDetail}>Tamaño: {item.detalles_tamano}</Text>}
        {item.detalles_notas && <Text style={styles.itemDetail}>Notas: {item.detalles_notas}</Text>}
        {item.detalles_precio_extra && <Text style={styles.itemDetail}>Extra: ${parseFloat(item.detalles_precio_extra).toFixed(2)}</Text>}
        <Text style={styles.itemDetail}>Estado: {item.estado}</Text>
        <View style={styles.payButtonContainer}>
          <Button title="Pagar" onPress={() => handlePayPress(item)} color="#9d2a2aff" />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContent}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff0f0',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff5f5', // Tono de rojo mejorado
    padding: 20,
  },
  loaderText: {
    marginTop: 10,
    fontSize: 18,
    color: '#a00',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#a00', // Rojo oscuro
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cartItemContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 15,
    width: '46%',
    margin: '2%',
    shadowColor: '#a00', // Sombra roja
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
    alignItems: 'center',
  },
  productImageContainer: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 8,
  },
  productImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  noImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ffdbd9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: '#a00',
    fontSize: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#a00', // Rojo oscuro
    textAlign: 'center',
  },
  itemDetail: {
    fontSize: 12,
    color: '#777',
    marginBottom: 2,
    textAlign: 'center',
  },
  totalCost: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
    color: '#d00', // Rojo más vibrante
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
  },
  emptyCartText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff6b6b',
  },
  payButtonContainer: {
    marginTop: 20,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CarritoScreen;