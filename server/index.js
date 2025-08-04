import express from "express";
import { PORT } from "./config.js";
import cors from 'cors';
import indexRoutes from './routes/index.routes.js';
import orderRoutes from './routes/order.routes.js';
import productsRoutes from './routes/products.routes.js';
import adminRoutes from './routes/admins.routes.js';
import clientRoutes from './routes/clients.routes.js';
import catalogRoutes from './routes/catalog.routes.js'
import path from 'path';
import { fileURLToPath } from 'url';

// Configuración para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();

// --- Middleware para manejar archivos estáticos ---
// Esto permite que se pueda acceder a los archivos de la carpeta 'public'
// como imágenes, CSS, etc. a través de una URL.
app.use(express.static('public'));
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

app.use(cors());
app.use(express.json());

// --- Tus rutas existentes ---
app.use(indexRoutes);
app.use(orderRoutes);
app.use(productsRoutes);
app.use(adminRoutes);
app.use(clientRoutes);
app.use(catalogRoutes);

app.listen(PORT);
console.log(`Se esta ejecutando en el puerto ${PORT}`);