import express from "express";
import {
  getInventory,
  addOrUpdateInventory
} from "./inventory.controller.js";
import authMiddleware from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, getInventory);
router.post("/", authMiddleware, addOrUpdateInventory);

export default router;

