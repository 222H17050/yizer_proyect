import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, Image, Pressable} from 'react-native';
import { getCatalogStandard } from '../api/client';
import { useAuth } from '../authentication/AuthContext';
import { useRouter } from 'expo-router'; // ¡Cambio aquí! Usa useRouter

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
  imagen_url: string;
  variantes: Variante[];
}

export default function StandardProductsScreen() {
  const router = useRouter(); // ¡Cambio aquí! Usa el hook useRouter
  const { user } = useAuth();

  if (!user) {
    return <Text>No tienes permiso para ver esto.</Text>
  }
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const result = await getCatalogStandard();
        if (isMounted) {
          setProductos(result);
        }
      } catch (error) {
        console.error('Error cargando productos estándar:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
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
          <Text>{producto.descripcion}</Text>
          <Text>Precio: ${producto.precio_base}</Text>
          <Pressable
            style={styles.addToCartButton}
            onPress={() => router.push(`/${producto.id_producto}`)} // ¡Cambio aquí! Usa router.push
          >
            <Text style={styles.buttonText}>Agregar al carrito</Text>
          </Pressable>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff0f0', // Fondo rojo muy claro
  },
  loader: {
    marginTop: 20,
  },
  productoContainer: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 16,
    borderRadius: 20, // Bordes más redondeados
    shadowColor: '#a00', // Sombra con un toque de rojo
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  productImage: {
    width: '100%',
    height: 200,
    marginBottom: 12,
    borderRadius: 15, // Bordes redondeados para la imagen
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#a00', // Título en rojo oscuro
  },
  subtitle: {
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
    color: '#888',
  },
  varianteContainer: {
    marginLeft: 12,
    marginTop: 8,
    padding: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#ff6b6b', // Borde en rojo
  },
  variantesContainer: {
    marginVertical: 10,
  },
  listaContainer: {
    marginBottom: 8,
  },
  listaTitulo: {
    fontWeight: 'bold',
  },
  addToCartButton: {
    backgroundColor: '#ff6b6b', // Botón en rojo
    padding: 14,
    borderRadius: 25, // Bordes muy redondeados para el botón
    marginTop: 15,
    alignItems: 'center',
    shadowColor: '#a00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

