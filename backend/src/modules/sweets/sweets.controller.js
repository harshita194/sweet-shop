import Sweet from "./sweets.model.js";
import Inventory from "../inventory/inventory.model.js";

/**
 * GET /api/sweets
 * Public endpoint to view all available sweets
 * No authentication required for viewing
 */
export const getAllSweets = async (req, res) => {
  try {
    const sweets = await Sweet.find().sort({ createdAt: -1 });
    res.json(sweets);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch sweets" });
  }
};

/**
 * GET search sweets by name, category, or price range
 */
export const searchSweets = async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;
    const query = {};

    if (name) {
      query.name = { $regex: name, $options: "i" };
    }

    if (category) {
      query.category = { $regex: category, $options: "i" };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    const sweets = await Sweet.find(query);
    res.json(sweets);
  } catch (err) {
    res.status(500).json({ message: "Failed to search sweets" });
  }
};

/**
 * POST /api/sweets
 * Protected route - authenticated users can add new sweets
 * Requires JWT token in Authorization header
 */
export const createSweet = async (req, res) => {
  try {
    const { name, category, price, quantity } = req.body;

    // Validate all required fields
    if (!name || !category || price === undefined || quantity === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate price and quantity are non-negative
    if (price < 0 || quantity < 0) {
      return res.status(400).json({ message: "Price and quantity must be non-negative" });
    }

    const sweet = await Sweet.create({ name, category, price, quantity });
    res.status(201).json(sweet);
  } catch (err) {
    res.status(400).json({ message: "Failed to create sweet", error: err.message });
  }
};

/**
 * PUT /api/sweets/:id
 * Protected route - authenticated users can update sweet details
 * Updates name, category, price, or quantity
 */
export const updateSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!sweet) {
      return res.status(404).json({ message: "Sweet not found" });
    }

    res.json(sweet);
  } catch (err) {
    res.status(400).json({ message: "Failed to update sweet", error: err.message });
  }
};

/**
 * DELETE /api/sweets/:id
 * Admin only route - requires admin role
 * Deletes a sweet and its associated inventory record
 */
export const deleteSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findByIdAndDelete(req.params.id);

    if (!sweet) {
      return res.status(404).json({ message: "Sweet not found" });
    }

    // Clean up associated inventory record if it exists
    await Inventory.findOneAndDelete({ sweet: sweet._id });

    res.json({ message: "Sweet deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: "Failed to delete sweet" });
  }
};

/**
 * POST /api/sweets/:id/purchase
 * Protected route - authenticated users can purchase sweets
 * Decreases the quantity of a sweet by the specified amount (default: 1)
 */
export const purchaseSweet = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity = 1 } = req.body;

    const sweet = await Sweet.findById(id);

    if (!sweet) {
      return res.status(404).json({ message: "Sweet not found" });
    }

    // Check if sufficient stock is available
    if (sweet.quantity < quantity) {
      return res.status(400).json({ 
        message: "Insufficient quantity in stock",
        available: sweet.quantity 
      });
    }

    // Decrease quantity and save
    sweet.quantity -= quantity;
    await sweet.save();

    res.json({
      message: "Purchase successful",
      sweet: sweet
    });
  } catch (err) {
    res.status(400).json({ message: "Failed to purchase sweet", error: err.message });
  }
};

/**
 * POST /api/sweets/:id/restock
 * Admin only route - requires admin role
 * Increases the quantity of a sweet by the specified amount
 */
export const restockSweet = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    // Validate quantity
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: "Valid quantity is required" });
    }

    const sweet = await Sweet.findById(id);

    if (!sweet) {
      return res.status(404).json({ message: "Sweet not found" });
    }

    // Increase quantity and save
    sweet.quantity += quantity;
    await sweet.save();

    res.json({
      message: "Restock successful",
      sweet: sweet
    });
  } catch (err) {
    res.status(400).json({ message: "Failed to restock sweet", error: err.message });
  }
};

