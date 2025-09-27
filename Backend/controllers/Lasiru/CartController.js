// controllers/cartController.js
import Cart from "../../models/Lasiru/cart.js";
import Order from "../../models/Lasiru/order.js";
import mongoose from "mongoose";

export const getCartById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid cart id" });
    }

    const cart = await Cart.findById(id).populate("items.productId", "name price weight");
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const items = cart.items.map((it) => ({
      productId: it.productId._id ? it.productId._id : it.productId,
      name: it.productId.name ?? "Unknown Product",
      quantity: it.quantity,
      price: it.price ?? it.productId.price ?? 0,
      subtotal: it.subtotal ?? (it.quantity * (it.price ?? it.productId.price ?? 0)),
    }));
    const total = items.reduce((s, it) => s + it.subtotal, 0);

    return res.json({
      id: cart._id,
      customerId: cart.customerId,
      items,
      total,
      totalWeight: cart.totalWeight ?? items.reduce((s, it) => s + ((it.weight ?? 0) * it.quantity), 0),
      promocode: cart.promocode ?? null,
    });
  } catch (err) {
    console.error("getCartById:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const payNow = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid cart id" });

    const cart = await Cart.findById(id).populate("items.productId", "name");
    if (!cart) return res.status(404).json({ error: "Cart not found" });


    const paymentResult = {
      status: "success",
      provider: "demo",
      transactionId: `txn_${Date.now()}`,
    };

    if (typeof Order !== "undefined") {
      await Order.create({
        cartId: cart._id,
        customerId: cart.customerId,
        items: cart.items,
        total: cart.items.reduce((s, it) => s + it.subtotal, 0),
        paymentMethod: "online",
        paymentInfo: paymentResult,
        status: "paid",
      });
    }

    return res.json({ message: "Payment successful", paymentResult });
  } catch (err) {
    console.error("payNow:", err);
    res.status(500).json({ error: "Payment error" });
  }
};

export const codOrder = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid cart id" });

    const cart = await Cart.findById(id).populate("items.productId", "name");
    if (!cart) return res.status(404).json({ error: "Cart not found" });


    if (typeof Order !== "undefined") {
      await Order.create({
        cartId: cart._id,
        customerId: cart.customerId,
        items: cart.items,
        total: cart.items.reduce((s, it) => s + it.subtotal, 0),
        paymentMethod: "cod",
        paymentInfo: null,
        status: "pending",
      });
    }

    return res.json({ message: "Order placed (COD). We'll contact you to collect payment on delivery." });
  } catch (err) {
    console.error("codOrder:", err);
    res.status(500).json({ error: "COD error" });
  }
};
