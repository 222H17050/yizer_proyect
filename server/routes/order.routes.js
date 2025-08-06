import { Router } from "express";
import {
  getOrder,
  deleteOrder,
} from "../controllers/order.controllers.js";

const router = Router();

router.get("/order", getOrder);

router.put("/order/:id", deleteOrder);

export default router;