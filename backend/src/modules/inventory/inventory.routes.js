import express from "express";
import {
  getInventory,
  addOrUpdateInventory
} from "./inventory.controller.js";
import authMiddleware from "../../middleware/auth.middleware.js";
import adminMiddleware from "../../middleware/admin.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, adminMiddleware, getInventory);
router.post("/", authMiddleware, adminMiddleware, addOrUpdateInventory);

export default router;