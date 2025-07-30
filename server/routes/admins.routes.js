import { Router } from "express";
import {
    getAllAdmins,
    createAdmin,
    deleteAdmin,
    verifyAdmin
} from "../controllers/admins.controllers.js";

const router = Router();

router.get("/admin", getAllAdmins)

router.post("/admin", createAdmin);

router.delete("/admin/:id", deleteAdmin);

router.post("/admin/verify", verifyAdmin);

export default router;