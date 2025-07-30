import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000'; // Cambia por tu IP o dominio

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 segundos
});

// Ejemplo: Obtener datos
export const fetchData = async () => {
  try {
    const response = await apiClient.get('/products');
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};