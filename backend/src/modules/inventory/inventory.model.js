import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    sweet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sweet",
      required: true,
     // unique: true
    },
    quantity: {
      type: Number,
      required: true,
      // min: 0
    }
  },
  { timestamps: true }
);

export default mongoose.model("Inventory", inventorySchema);

