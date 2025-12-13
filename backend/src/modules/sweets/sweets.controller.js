import Sweet from "./sweets.model.js";
import Inventory from "../inventory/inventory.model.js";

/**
 * GET all sweets
 */
export const getAllSweets = async (req, res) => {
  try {
    const sweets = await Sweet.find();
    res.json(sweets);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch sweets" });
  }
};

/**
 * POST add new sweet (protected)
 */
export const createSweet = async (req, res) => {
  try {
    const sweet = await Sweet.create(req.body);
    res.status(201).json(sweet);
  } catch (err) {
    res.status(400).json({ message: "Failed to create sweet" });
  }
};

/**
 * PUT update sweet
 */
export const updateSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (sweet && req.body.quantity) {
        await Inventory.findOneAndUpdate(
          { sweet: sweet._id },
          { $inc: { quantity: req.body.quantity } },
          { upsert: true }
        );
    }
    res.json(sweet);
  } catch (err) {
    res.status(400).json({ message: "Failed to update sweet" });
  }
};

/**
 * DELETE sweet
 */
export const deleteSweet = async (req, res) => {
  try {
    await Sweet.findByIdAndDelete(req.params.id);
    res.json({ message: "Sweet deleted" });
  } catch (err) {
    res.status(400).json({ message: "Failed to delete sweet" });
  }
};

