import { Router } from 'express';
import {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
  verifyClient
} from '../controllers/clientes.controllers.js'; // Ajusta la ruta si es necesario

const router = Router();

// Rutas para clientes
router.post('/clients', createClient);             // Crear un nuevo cliente
router.get('/clients', getClients);                // Obtener todos los clientes
router.get('/clients/:id', getClientById);         // Obtener un cliente por ID
router.put('/clients/:id', updateClient);          // Actualizar un cliente por ID
router.delete('/clients/:id', deleteClient);       // Eliminar un cliente por ID

router.post('/clients/verify', verifyClient);      // Verificar credenciales de cliente (login)

export default router;