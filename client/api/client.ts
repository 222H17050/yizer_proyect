import axios from 'axios';

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
  variantes: Variante[];
  imagen_url: string;
}

// Interfaz para los datos del cliente que vas a enviar (ej. para crear o verificar)
interface ClientAuthData {
  correo: string;
  contraseña: string;
}

// Interfaz para los datos completos del cliente que devuelve el servidor (sin contraseña)
export interface ClientData {
  id_cliente: string; // O number, según tu DB
  nombre: string;
  correo: string;
  telefono: string;// Ahora es string, como lo modificamos en la DB
  // Agrega otras propiedades si tu servidor las devuelve al autenticar o crear
}

// Interfaz para los datos completos del cliente para la creación (incluye telefono y direccion)
// Omitir 'id_cliente' ya que lo genera el servidor
interface ClientCreateData extends ClientAuthData {
  nombre: string;
  telefono: string;
}

// Interface for the data to send when creating a cart item
interface CartCreateData {
  id_cliente: string;
  id_producto: string;
  cantidad: number;
  direccion: string;
  detalles_pedido?: {
    posicion: string;
    tamaño: string;
    notas: string;
    precio_extra: number;
  };
}

// Interface for the data returned by the API after creating a cart item
interface CartCreateResponse {
  id_pedido: number;
  costo_total: number;
  id_producto: string;
  cantidad: number;
}

// Interface for a single item in the cart returned by the API
export interface CartItem {
  cantidad: number;
  costo_total: number;
  nombre_producto: string;
  imagen_url: string;
  precio_unitario: number;
  estado: string;
  detalles_posicion?: string;
  detalles_tamano?: string;
  detalles_notas?: string;
  detalles_precio_extra?: number;
}

// Interfaz genérica para la respuesta de la API (success, message, data)
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T; // data es opcional y puede ser de cualquier tipo T
  error?: string; // Para capturar mensajes de error más detallados del backend
}



const API_BASE_URL = 'http://localhost:4000'; // Cambia por tu IP o dominio

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 segundos
});

// --- Funciones para interactuar con la API de Productos ---

// Obtener todos los productos
export const getCatalogStandard = async (): Promise<Producto[]> => {
  try {
    const response = await apiClient.get('/catalog/standard');
    return response.data; // TypeScript inferirá que es Producto[] si tu backend lo devuelve así
  } catch (error) {
    console.error('Error fetching all products:', error);
    throw error;
  }
};

export const getCatalogCustomizable = async (): Promise<Producto[]> => {
  try {
    const response = await apiClient.get('/catalog/customizable');
    return response.data; // TypeScript inferirá que es Producto[] si tu backend lo devuelve así
  } catch (error) {
    console.error('Error fetching all products:', error);
    throw error;
  }
};

// Agrega esta función al final del archivo client.ts
export const getFromCatalog = async (id: string): Promise<Producto> => {
  try {
    const response = await apiClient.get(`/catalog/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    throw error;
  }
};

// Función verifyClient corregida
export const verifyClient = async (credentials: ClientAuthData): Promise<ApiResponse<ClientData>> => {
  try {
    // La ruta para verificar es POST /clients/verify
    const response = await apiClient.post('/clients/verify', credentials);
    // Asegurarse de que response.data coincida con ApiResponse<ClientData>
    return response.data;
  } catch (error: any) { // AxiosError tiene una estructura específica
    console.error('Error verifying client:', error);
    // Es importante re-lanzar el error o devolver un error estructurado
    // Si Axios devuelve un error con response.data (ej. del backend)
    if (error.response && error.response.data) {
      // Si el backend envía { success: false, message: "..." }
      return error.response.data;
    }
    // Para errores de red o cualquier otro error
    throw error;
  }
};

// Función createClient
export const createClient = async (clientData: ClientCreateData): Promise<ApiResponse<ClientData>> => {
  try {
    // La ruta para crear es POST /clients
    const response = await apiClient.post('/clients', clientData);
    return response.data; // El servidor debería devolver ApiResponse<ClientData>
  } catch (error: any) {
    console.error('Error creating client:', error);
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw error;
  }
};

// --- Funciones para interactuar con la API de Carrito ---

// Función para crear un nuevo ítem en el carrito
export const createCartItem = async (cartData: CartCreateData): Promise<ApiResponse<CartCreateResponse>> => {
  try {
    const response = await apiClient.post('/cart', cartData);
    return response.data;
  } catch (error: any) {
    console.error('Error creating cart item:', error);
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw error;
  }
};

// Función para obtener el carrito de un cliente por su ID
export const getCartByClient = async (id_cliente: string): Promise<ApiResponse<CartItem[]>> => {
  try {
    const response = await apiClient.get(`/cart/${id_cliente}`);
    // La API devuelve un objeto con la propiedad `cart`
    // Necesitas acceder a `response.data.cart` para obtener el array de ítems
    return {
      ...response.data,
      data: response.data.cart,
    };
  } catch (error: any) {
    console.error(`Error fetching cart for client ID ${id_cliente}:`, error);
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw error;
  }
};