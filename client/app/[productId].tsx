import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TextInput, Button, Alert } from 'react-native';
import { getFromCatalog, createCartItem, ApiResponse } from '../api/client';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../authentication/AuthContext';
import { Picker } from '@react-native-picker/picker';

// Interfaz para las variantes del producto
interface Variante {
  id_variante: string;
  talla: string;
  color: string;
  stock: number;
}

// Interfaz para la estructura del producto
interface Producto {
  id_producto: string;
  nombre: string;
  modelo: string;
  precio_base: number;
  descripcion: string;
  variantes: Variante[];
  tipo: string; // Asegúrate de que esta propiedad esté presente en los datos que devuelve tu API
  imagen_url: string;
}

// Interfaz para los datos del formulario de compra
interface PurchaseFormValues {
  cantidad: string;
  direccion: string;
  detalles_posicion?: string;
  detalles_tamano?: string;
  detalles_notas?: string;
  detalles_precio_extra?: string; // Sigue siendo string porque Formik maneja los inputs como strings
}

// Esquema de validación para el formulario de compra usando Yup
const PurchaseSchema = Yup.object().shape({
  cantidad: Yup.number()
    .required('La cantidad es obligatoria')
    .min(1, 'La cantidad debe ser al menos 1')
    .typeError('La cantidad debe ser un número válido'),
  direccion: Yup.string()
    .required('La dirección es obligatoria')
    .min(5, 'La dirección debe tener al menos 5 caracteres'),
  // Ya no necesitamos una validación compleja para detalles_precio_extra si es calculado
  // Podríamos eliminarlo del esquema si no queremos que Yup lo valide,
  // pero mantenerlo como number con transform es seguro si el valor es siempre numérico.
  detalles_precio_extra: Yup.number()
    .nullable()
    .min(0, 'El precio extra no puede ser negativo')
    .typeError('El precio extra debe ser un número válido'),
});

// Opciones para el Picker de Posición
const posicionOptions = [
  { label: 'Selecciona una posición (Opcional)', value: '' },
  { label: 'Arriba Izquierda', value: 'arriba izquierda' },
  { label: 'Arriba Centro', value: 'arriba centro' },
  { label: 'Arriba Derecha', value: 'arriba derecha' },
  { label: 'Centro Izquierda', value: 'centro izquierda' },
  { label: 'Centro Centro', value: 'centro centro' },
  { label: 'Centro Derecha', value: 'centro derecha' },
  { label: 'Abajo Izquierda', value: 'abajo izquierda' },
  { label: 'Abajo Centro', value: 'abajo centro' },
  { label: 'Abajo Derecha', value: 'abajo derecha' },
];

// Opciones para el Picker de Tamaño
const tamanoOptions = [
  { label: 'Selecciona un tamaño (Opcional)', value: '' },
  { label: 'Pequeño (10cm)', value: 'pequeño (10cm)' },
  { label: 'Mediano (20cm)', value: 'mediano (20cm)' },
  { label: 'Grande (30cm)', value: 'grande (30cm)' },
  { label: 'Enorme (40cm)', value: 'enorme (40cm)' },
];

// Componente principal de la pantalla de detalles del producto
export default function ProductDetailScreen() {
  const { productId } = useLocalSearchParams();
  const navigation = useNavigation();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useLayoutEffect(() => {
    if (producto) {
      navigation.setOptions({ title: producto.nombre });
    }
  }, [navigation, producto]);

  useEffect(() => {
    const fetchProduct = async () => {
      const id = Array.isArray(productId) ? productId[0] : productId;

      if (!id) {
        setError('ID de producto no proporcionado.');
        setLoading(false);
        return;
      }

      try {
        const productData: Producto = await getFromCatalog(id);
        setProducto(productData);
      } catch (err: any) {
        console.error('Error al obtener el producto:', err);
        setError('Error al cargar el producto. Por favor, inténtalo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = async (values: PurchaseFormValues, actions: any) => {
    if (!user || !user.id_cliente) {
      Alert.alert('Error de Autenticación', 'No se pudo obtener el ID del cliente. Por favor, inicia sesión para añadir productos al carrito.');
      actions.setSubmitting(false);
      return;
    }

    if (!producto) {
      Alert.alert('Error de Producto', 'No se pudo encontrar el producto para añadir al carrito.');
      actions.setSubmitting(false);
      return;
    }

    try {
      const cartData: any = {
        id_cliente: user.id_cliente,
        id_producto: producto.id_producto,
        cantidad: parseInt(values.cantidad),
        direccion: values.direccion,
      };

      if (producto.tipo === 'perzonalizable') {
        cartData.detalles_pedido = {
          posicion: values.detalles_posicion || '',
          tamaño: values.detalles_tamano || '',
          notas: values.detalles_notas || '',
          // Aseguramos que el precio_extra sea un número flotante, usando el valor calculado
          precio_extra: parseFloat(values.detalles_precio_extra || '0'),
        };
      }

      const result: ApiResponse<any> = await createCartItem(cartData);

      if (result && result.success) {
        Alert.alert('Éxito', result.message || 'Producto añadido al carrito correctamente.');
        actions.resetForm();
      } else {
        Alert.alert('Error', result.message || 'Ocurrió un error al añadir el producto al carrito.');
      }
    } catch (error: any) {
      console.error('Error en handleAddToCart:', error);
      Alert.alert('Error', 'Ocurrió un error inesperado al añadir el producto. Por favor, inténtalo de nuevo.');
    } finally {
      actions.setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando detalles del producto...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Reintentar" onPress={() => { setLoading(true); setError(null); /* Puedes re-ejecutar fetchProduct aquí si es necesario */ }} />
      </View>
    );
  }

  if (!producto) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Producto no encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {producto.imagen_url ? (
        <Image source={{ uri: `http://localhost:4000${producto.imagen_url}` }} style={styles.image} />
      ) : (
        <View style={styles.noImageContainer}>
          <Text style={styles.noImageText}>No hay imagen disponible</Text>
        </View>
      )}

      <Text style={styles.nombre}>{producto.nombre}</Text>
      <Text style={styles.descripcion}>{producto.descripcion}</Text>
      <Text style={styles.precio}>Precio: ${producto.precio_base}</Text>
      <View style={styles.separator} />

      <Formik
        initialValues={{
          cantidad: '1',
          direccion: '',
          detalles_posicion: '',
          detalles_tamano: '',
          detalles_notas: '',
          detalles_precio_extra: '150', // Valor inicial por defecto de 150
        }}
        validationSchema={PurchaseSchema}
        onSubmit={handleAddToCart}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting, setFieldValue }) => {
          // Lógica para calcular el precio extra basada en la cantidad
          useEffect(() => {
            const currentCantidad = parseInt(values.cantidad);
            let newPrecioExtra = 150; // Valor por defecto

            if (!isNaN(currentCantidad) && currentCantidad > 5) {
              newPrecioExtra = 100; // Si la cantidad es mayor a 5
            }

            // Convertimos el valor actual del estado de Formik a número para comparar
            const currentPrecioExtraInState = parseFloat(values.detalles_precio_extra || '0');

            // Solo actualizamos si el valor calculado es diferente al que ya está en Formik
            if (currentPrecioExtraInState !== newPrecioExtra) {
              setFieldValue('detalles_precio_extra', String(newPrecioExtra), false); // false para no re-validar/tocar en cada cambio
            }
          }, [values.cantidad, setFieldValue, values.detalles_precio_extra]); // Dependencias: cantidad y setFieldValue

          return (
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>Añadir al Carrito</Text>

              <Text style={styles.label}>Cantidad:</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange('cantidad')}
                onBlur={handleBlur('cantidad')}
                value={values.cantidad}
                keyboardType="numeric"
              />
              {errors.cantidad && touched.cantidad && <Text style={styles.errorText}>{errors.cantidad}</Text>}

              <Text style={styles.label}>Dirección:</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange('direccion')}
                onBlur={handleBlur('direccion')}
                value={values.direccion}
                multiline
              />
              {errors.direccion && touched.direccion && <Text style={styles.errorText}>{errors.direccion}</Text>}

              {/* INICIO DE LA SECCIÓN CONDICIONAL */}
              {producto.tipo === 'perzonalizable' && (
                <View>
                  <Text style={styles.label}>Posición:</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={values.detalles_posicion}
                      onValueChange={(itemValue) => setFieldValue('detalles_posicion', itemValue)}
                      style={styles.picker}
                    >
                      {posicionOptions.map((option) => (
                        <Picker.Item key={option.value} label={option.label} value={option.value} />
                      ))}
                    </Picker>
                  </View>

                  <Text style={styles.label}>Tamaño:</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={values.detalles_tamano}
                      onValueChange={(itemValue) => setFieldValue('detalles_tamano', itemValue)}
                      style={styles.picker}
                    >
                      {tamanoOptions.map((option) => (
                        <Picker.Item key={option.value} label={option.label} value={option.value} />
                      ))}
                    </Picker>
                  </View>

                  <Text style={styles.label}>Notas:</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange('detalles_notas')}
                    onBlur={handleBlur('detalles_notas')}
                    value={values.detalles_notas}
                  />

                  {/* Mostramos el Precio Extra Calculado, no un input */}
                  <Text style={styles.label}>Precio Extra Calculado:</Text>
                  <Text style={styles.calculatedPriceText}>
                    ${parseFloat(values.detalles_precio_extra || '0').toFixed(2)}
                  </Text>
                  {/* Ya no necesitamos mostrar errores de validación para un campo calculado */}
                </View>
              )}
              {/* FIN DE LA SECCIÓN CONDICIONAL */}

              <Button
                onPress={() => handleSubmit()}
                title={isSubmitting ? "Añadiendo..." : "Añadir al Carrito"}
                disabled={isSubmitting}
              />
            </View>
          );
        }}
      </Formik>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  noImageContainer: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    marginBottom: 20,
    borderRadius: 10,
  },
  noImageText: {
    color: '#888',
    fontSize: 16,
  },
  nombre: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  descripcion: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  precio: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'green',
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 20,
  },
  formContainer: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 5,
  },
  errorText: {
    fontSize: 12,
    color: 'red',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 5,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  calculatedPriceText: { // Nuevo estilo para el texto del precio calculado
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
    marginBottom: 10,
  },
});
