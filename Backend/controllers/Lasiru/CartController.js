// controllers/cartController.js
import Cart from "../../models/Lasiru/cart.js";
import Promocode from "../../models/Lasiru/promocode.js";
import mongoose from "mongoose";

export const getCartByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    // Find cart and populate customer & product info
    const cart = await Cart.findOne({ customerId: userId })
      .populate("customerId", "name email")
      .populate("items.productId", "name price weight");

    if (!cart) return res.status(404).json({ error: "Cart not found" });

    // Map items with proper subtotal
    const items = cart.items.map((it) => ({
      productId: it.productId._id ? it.productId._id : it.productId,
      name: it.productId.name ?? "Unknown Product",
      weight: it.productId.weight ?? 0,
      quantity: it.quantity,
      price: it.price ?? it.productId.price ?? 0,
      subtotal: it.subtotal ?? it.quantity * (it.price ?? it.productId.price ?? 0),
    }));

    // Calculate total and totalWeight
    let total = items.reduce((sum, it) => sum + it.subtotal, 0);
    let totalWeight = items.reduce((sum, it) => sum + it.weight * it.quantity, 0);

    let discountApplied = null;
    let promoMessage = null;

    // Validate promocode
    if (cart.promocode) {
      const promo = await Promocode.findOne({ code: cart.promocode });
      if (
        !promo ||
        !promo.isActive ||
        promo.expiryDate <= new Date() ||
        promo.usedCount >= promo.usageLimit
      ) {
        promoMessage = "Promocode is invalid or expired";
      } else {
        if (promo.discountType === "percentage") {
          const discount = (total * promo.discountValue) / 100;
          total -= discount;
          discountApplied = { type: "percentage", value: promo.discountValue, discount };
        } else if (promo.discountType === "fixed") {
          total -= promo.discountValue;
          discountApplied = { type: "fixed", value: promo.discountValue, discount: promo.discountValue };
        }
      }
    }

    return res.json({
      id: cart._id,
      customer: cart.customerId?.name ?? "N/A",
      items,
      total,
      totalWeight: cart.totalWeight ?? totalWeight,
      promocode: cart.promocode ?? null,
      discountApplied,
      promoMessage,
    });
  } catch (err) {
    console.error("getCartByUser:", err);
    res.status(500).json({ error: "Server error" });
  }
};
