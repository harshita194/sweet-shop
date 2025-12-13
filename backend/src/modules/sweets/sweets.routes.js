import express from "express";
import {
  getAllSweets,
  createSweet,
  updateSweet,
  deleteSweet
} from "./sweets.controller.js";

import authMiddleware from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAllSweets);

// protected routes
router.post("/", authMiddleware, createSweet);
router.put("/:id", authMiddleware, updateSweet);
router.delete("/:id", authMiddleware, deleteSweet);

export default router;

