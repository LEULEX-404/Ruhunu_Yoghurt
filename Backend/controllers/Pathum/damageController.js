import Damage from "../../models/Pathum/damage.js";
import Product from "../../models/Pathum/product.js"; // ✅ Import your Product model
import { isAdmin } from "../Tharuka/employeeController.js";

export async function addDamage(req, res) {
  if (!isAdmin(req)) {
    return res.status(403).json({
      message: "You are not authorized to add a damage product",
    });
  }

  try {
    const { productId, name, reason, quantity } = req.body;

    // ✅ Check if the product exists
    const product = await Product.findOne({ productId });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // ✅ Ensure we have enough quantity to mark as damaged
    if (product.quantity < quantity) {
      return res.status(400).json({
        message: `Not enough quantity in stock. Available: ${product.quantity}`,
      });
    }

    // ✅ Save the damage record
    const damage = new Damage({ productId, name, reason, quantity });
    await damage.save();

    // ✅ Reduce the product quantity in the product collection
    await Product.findOneAndUpdate(
      { productId },
      { $inc: { quantity: -quantity } }
    );

    return res.json({
      message: "Damage product added and stock updated successfully",
    });
  } catch (err) {
    console.error("Error adding damage:", err);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
}

export async function getAllDamages(req, res) {
  if (!isAdmin(req)) {
    return res.status(403).json({
      message: "You are not authorized to view damage products",
    });
  }

  try {
    const damages = await Damage.find().sort({ _id: -1 }); // latest first
    return res.json(damages);
  } catch (err) {
    console.error("Error fetching damages:", err);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
}

