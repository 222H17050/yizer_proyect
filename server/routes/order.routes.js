import { Router } from "express";
import {
  getOrder,
  deleteOrder,
  updateOrder,
} from "../controllers/order.controllers.js";

const router = Router();

router.get("/order", getOrder);


router.put("/order/:id", deleteOrder);

router.delete("/order/:id", updateOrder);

export default router;