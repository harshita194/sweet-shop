import express from "express";
import {
  getAllSweets,
  searchSweets,
  createSweet,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet
} from "./sweets.controller.js";

import authMiddleware from "../../middleware/auth.middleware.js";
import adminMiddleware from "../../middleware/admin.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllSweets);
router.get("/search", searchSweets);

// Protected routes (authenticated users)
router.post("/:id/purchase", authMiddleware, purchaseSweet);

// Protected routes (authenticated users)
router.post("/", authMiddleware, createSweet);
router.put("/:id", authMiddleware, updateSweet);

// Admin only routes
router.delete("/:id", authMiddleware, adminMiddleware, deleteSweet);
router.post("/:id/restock", authMiddleware, adminMiddleware, restockSweet);

export default router;

