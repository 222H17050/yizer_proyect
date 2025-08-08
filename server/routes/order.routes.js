import { Router } from "express";
import {
  getOrder
} from "../controllers/order.controllers.js";

const router = Router();

router.get("/order", getOrder);

export default router;