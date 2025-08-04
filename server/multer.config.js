import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta absoluta corregida
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Usar path.resolve para obtener ruta absoluta correcta
    const destPath = path.resolve(__dirname, './public/images/products');
    cb(null, destPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Mantener la extensión original del archivo
    const ext = path.extname(file.originalname);
    cb(null, 'product-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // Límite de 5MB
  }
});

export default upload;