import { Router } from "express";
import {
  getproducts,
  getproduct,
  createproducts,
  deleteproducts,
  updateproducts,
} from "../controllers/products.controllers.js";

const router = Router();

router.get("/products", getproducts);

router.get("/product", getproduct);

router.post("/products", createproducts);

router.put("/products/:id", deleteproducts);

router.delete("/products/:id", updateproducts);

export default router;