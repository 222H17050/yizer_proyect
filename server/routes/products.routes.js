// routes/productRoutes.js
import { Router } from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  createVariant,
  updateVariant,
  deleteVariant
} from '../controllers/products.controllers.js';

const router = Router();

// Rutas para productos
router.get('/products', getProducts);
router.get('/products/:id', getProduct);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Rutas para variantes
router.post('/:productId/variants', createVariant);
router.put('/:productId/variants/:variantId', updateVariant);
router.delete('/:productId/variants/:variantId', deleteVariant);

export default router;