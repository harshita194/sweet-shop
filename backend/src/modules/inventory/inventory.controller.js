import Inventory from "./inventory.model.js";

export const getInventory = async (req, res) => {
  // const inventory = await Inventory.find().populate("sweet");
  // res.json(inventory);
  res.status(200).json([]);
};

export const addOrUpdateInventory = async (req, res) => {
  const { sweetId, quantity } = req.body;

  if (!sweetId || quantity == null) {
    return res.status(400).json({ message: "Sweet ID & quantity required" });
  }

  const inventory = await Inventory.findOneAndUpdate(
    { sweet: sweetId },
    { quantity },
    { upsert: true, new: true }
  );

  res.status(200).json(inventory);
};

