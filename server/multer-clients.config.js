import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Storage configuration for client images
const clientStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Use path.resolve to get the correct absolute path
    const destPath = path.resolve(__dirname, './public/images/clients');
    cb(null, destPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Keep the original file extension
    const ext = path.extname(file.originalname);
    cb(null, `client-${uniqueSuffix}${ext}`);
  }
});

// Este es el cambio: añadimos .single('clientImage') para especificar el campo.
// El nombre 'clientImage' debe coincidir exactamente con el nombre que usas en el cliente.
const uploadClients = multer({
  storage: clientStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
}).single('clientImage'); 

// Export the upload configuration for clients
export default uploadClients;