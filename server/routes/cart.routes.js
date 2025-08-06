// routes/productRoutes.js
import { Router } from 'express';
import upload from '../multer.config.js';
import {
    getCart,
    createCart
} from '../controllers/cart.controllers.js';

const router = Router();

router.get('/cart/:id', getCart);
router.post('/cart', createCart);

export default router;