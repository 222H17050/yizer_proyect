// routes/productRoutes.js
import { Router } from 'express';
import {
  getCatalogStandard,
  getCatalogCustomizable,
  getFromCatalog,
} from '../controllers/catalog.controllers.js';

const router = Router();

router.get('/catalog/standard', getCatalogStandard);
router.get('/catalog/customizable', getCatalogCustomizable);
router.get('/catalog/:id', getFromCatalog);

export default router;