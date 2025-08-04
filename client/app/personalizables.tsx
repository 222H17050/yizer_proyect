import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, Image } from 'react-native';
import { getCatalogCustomizable } from '../api/client';
import { useAuth } from '../authentication/AuthContext';

interface Variante {
  id_variante: string;
  talla: string;
  color: string;
  stock: number;
}

interface Producto {
  id_producto: string;
  nombre: string;
  modelo: string;
  precio_base: number;
  descripcion: string;
  imagen_url: string ; // Cambiado de image_url a imagen_url
  variantes: Variante[];
}

export default function CustomizableProductsScreenc() {
  const { user } = useAuth();

  if (!user) {
    return <Text>No tienes permiso para ver esto.</Text>
  }
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
    let isMounted = true;  // Para evitar actualizar estado si el componente se desmontó

    const loadData = async () => {
      try {
        const result = await getCatalogCustomizable();
        if (isMounted) {
          setProductos(result);
        }
      } catch (error) {
        console.error('Error cargando productos personalizables:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;  // Limpieza al desmontar
    };
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  return (
    <ScrollView style={styles.container}>
      {productos.map((producto) => (
        <View key={producto.id_producto} style={styles.productoContainer}>
          {producto.imagen_url && (
            <Image 
              source={{ uri: `http://localhost:4000${producto.imagen_url}` }}
              style={styles.productImage}
              resizeMode="contain"
            />
          )}
          <Text style={styles.nombre}>{producto.nombre}</Text>
          <Text>Modelo: {producto.modelo}</Text>
          <Text>Precio: ${producto.precio_base}</Text>
          <Text>Descripción: {producto.descripcion}</Text>

          <Text style={styles.subtitle}>Variantes:</Text>
          {producto.variantes && producto.variantes.length > 0 ? (
            producto.variantes.map((variante) => (
              <View key={variante.id_variante} style={styles.varianteContainer}>
                <Text>Talla: {variante.talla}</Text>
                <Text>Color: {variante.color}</Text>
                <Text>Stock: {variante.stock}</Text>
              </View>
            ))
          ) : (
            <Text>No hay variantes disponibles.</Text>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  loader: {
    marginTop: 20,
  },
  productoContainer: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 200,
    marginBottom: 12,
    borderRadius: 4,
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
    color: '#555',
  },
  varianteContainer: {
    marginLeft: 12,
    marginTop: 8,
    padding: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#ddd',
  },
});