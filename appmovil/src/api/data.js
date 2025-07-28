// Alineado con las tablas 'producto' y 'variante' de la base de datos
export const productos_base = [
  {
    id_producto: '1', // Corresponde a producto.id_producto
    nombre: 'Sudadera Grande', // Corresponde a producto.nombre
    modelo: 'Hoodie Clásico', // Añadido: Corresponde a producto.modelo
    tipo: 'perzonalizable', // Corresponde a producto.tipo
    descripcion: 'Sudadera de algodón suave y cómoda, ideal para cualquier ocasión. Disponible en varios colores y tallas.', // Corresponde a producto.descripcion
    precio_base: '250.00', // Corresponde a producto.precio_base
    disponible: 1, // Corresponde a producto.disponible (ejemplo: 1 para sí, 0 para no)
    imagen_url: 'https://placehold.co/300x300/B12A2A/FFFFFF?text=Sudadera', // URL de imagen para el frontend (no en DB directamente)
    // variantes_disponibles simula la información de la tabla 'variante'
    variantes_disponibles: [
      { id_variante: 'v1_1', talla: 'XS', color: 'Rojo', stock: 10, id_producto: '1' },
      { id_variante: 'v1_2', talla: 'S', color: 'Rojo', stock: 15, id_producto: '1' },
      { id_variante: 'v1_3', talla: 'M', color: 'Rojo', stock: 20, id_producto: '1' },
      { id_variante: 'v1_4', talla: 'L', color: 'Rojo', stock: 12, id_producto: '1' },
      { id_variante: 'v1_5', talla: 'XL', color: 'Rojo', stock: 8, id_producto: '1' },
      { id_variante: 'v1_6', talla: 'XXL', color: 'Rojo', stock: 5, id_producto: '1' },
      { id_variante: 'v1_7', talla: 'M', color: 'Negro', stock: 25, id_producto: '1' },
      { id_variante: 'v1_8', talla: 'L', color: 'Negro', stock: 18, id_producto: '1' },
      { id_variante: 'v1_9', talla: 'M', color: 'Blanco', stock: 30, id_producto: '1' },
      { id_variante: 'v1_10', talla: 'L', color: 'Blanco', stock: 22, id_producto: '1' },
      { id_variante: 'v1_11', talla: 'M', color: 'Gris', stock: 15, id_producto: '1' },
      { id_variante: 'v1_12', talla: 'L', color: 'Gris', stock: 10, id_producto: '1' },
    ],
    // Para conveniencia en el frontend, extraemos colores y tallas únicos
    colores_disponibles: ['Rojo', 'Negro', 'Blanco', 'Gris'],
    tallas_disponibles: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id_producto: '2',
    nombre: 'Playeras',
    modelo: 'Bomber Ligera', // Añadido: Corresponde a producto.modelo
    tipo: 'perzonalizable',
    descripcion: 'Playeras clásicas con diseño únicos, perfecta para el día a día. Fabricada con materiales de alta calidad.',
    precio_base: '320.00',
    disponible: 1,
    imagen_url: 'https://placehold.co/300x300/B12A2A/FFFFFF?text=Chaqueta',
    variantes_disponibles: [
      { id_variante: 'v2_1', talla: 'S', color: 'Azul', stock: 10, id_producto: '2' },
      { id_variante: 'v2_2', talla: 'M', color: 'Azul', stock: 15, id_producto: '2' },
      { id_variante: 'v2_3', talla: 'L', color: 'Azul', stock: 20, id_producto: '2' },
      { id_variante: 'v2_4', talla: 'XL', color: 'Azul', stock: 12, id_producto: '2' },
      { id_variante: 'v2_5', talla: 'M', color: 'Verde', stock: 18, id_producto: '2' },
      { id_variante: 'v2_6', talla: 'L', color: 'Verde', stock: 10, id_producto: '2' },
      { id_variante: 'v2_7', talla: 'M', color: 'Negro', stock: 25, id_producto: '2' },
      { id_variante: 'v2_8', talla: 'L', color: 'Negro', stock: 15, id_producto: '2' },
    ],
    colores_disponibles: ['Azul', 'Verde', 'Negro'],
    tallas_disponibles: ['S', 'M', 'L', 'XL']
  },
  {
    id_producto: '3',
    nombre: 'Camiseta Básica',
    modelo: 'Cuello Redondo Estándar', // Añadido: Corresponde a producto.modelo
    tipo: 'perzonalizable',
    descripcion: 'Camiseta de algodón 100%, ligera y transpirable. Un básico indispensable en tu armario.',
    precio_base: '180.00',
    disponible: 1,
    imagen_url: 'https://placehold.co/300x300/B12A2A/FFFFFF?text=Camiseta',
    variantes_disponibles: [
      { id_variante: 'v3_1', talla: 'XS', color: 'Blanco', stock: 30, id_producto: '3' },
      { id_variante: 'v3_2', talla: 'S', color: 'Blanco', stock: 40, id_producto: '3' },
      { id_variante: 'v3_3', talla: 'M', color: 'Blanco', stock: 50, id_producto: '3' },
      { id_variante: 'v3_4', talla: 'L', color: 'Blanco', stock: 35, id_producto: '3' },
      { id_variante: 'v3_5', talla: 'XL', color: 'Blanco', stock: 20, id_producto: '3' },
      { id_variante: 'v3_6', talla: 'M', color: 'Negro', stock: 45, id_producto: '3' },
      { id_variante: 'v3_7', talla: 'L', color: 'Negro', stock: 30, id_producto: '3' },
      { id_variante: 'v3_8', talla: 'M', color: 'Azul Claro', stock: 25, id_producto: '3' },
      { id_variante: 'v3_9', talla: 'L', color: 'Azul Claro', stock: 15, id_producto: '3' },
      { id_variante: 'v3_10', talla: 'M', color: 'Rosa', stock: 20, id_producto: '3' },
      { id_variante: 'v3_11', talla: 'L', color: 'Rosa', stock: 10, id_producto: '3' },
    ],
    colores_disponibles: ['Blanco', 'Negro', 'Azul Claro', 'Rosa'],
    tallas_disponibles: ['XS', 'S', 'M', 'L', 'XL']
  },
];

// Alineado con personalizacion.posicion
export const posiciones_estampado = ['Centro Frontal', 'Superior Izquierdo', 'Superior Derecho', 'Espalda Centro'];
// Alineado con personalizacion.tamaño
export const tamanos_estampado = ['Pequeño', 'Mediano', 'Grande'];
