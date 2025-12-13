import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes.js";
import sweetRoutes from "./modules/sweets/sweets.routes.js";
import inventoryRoutes from "./modules/inventory/inventory.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/sweets", sweetRoutes);
app.use("/api/inventory", inventoryRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Sweet Shop API Running" });
});

export default app;

