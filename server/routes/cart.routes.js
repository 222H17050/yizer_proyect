// routes/productRoutes.js
import { Router } from 'express';
import uploadClients from '../multer-clients.config.js';
import {
    getCart,
    createCart
} from '../controllers/cart.controllers.js';

const router = Router();

router.get('/cart/:id', getCart);
//router.post('/cart', createCart);
router.post('/cart', uploadClients, createCart);

export default router;