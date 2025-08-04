// routes/productRoutes.js
import { Router } from 'express';
import upload from '../multer.config.js'; 
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/products.controllers.js';

const router = Router();

router.get('/products', getProducts);
router.get('/products/:id', getProduct);

// Corregir el nombre del campo de archivo (de 'productImage' a 'image')
router.post('/products', upload.single('image'), createProduct);
router.put('/products/:id', upload.single('image'), updateProduct);
router.delete('/products/:id', deleteProduct);

export default router;