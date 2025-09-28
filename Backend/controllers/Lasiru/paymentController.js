import Payment from "../../models/Pathum/payment.js";
import Order from "../../models/Lasiru/order.js";
import User from "../../models/Tharuka/User.js";

// 🟢 PAY NOW
export const payNow = async (req, res) => {
  try {
    const { userId } = req.params;
    const { cardNumber, cardcvv, products, total, coupon } = req.body;

    // Validate request
    if (!cardNumber || !cardcvv) {
      return res.status(400).json({ error: "Card details required" });
    }
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "No products provided" });
    }
    if (!total || total <= 0) {
      return res.status(400).json({ error: "Invalid total amount" });
    }

    // Fetch user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // 🔹 Save Payment
    const payment = new Payment({
      paymentId: `PAY-${Date.now()}`,
      name: user.name,
      email: user.email,
      address: user.address,
      phone: user.phone,
      products,
      total,
      paymentMode: "card",
      cardNumber,
      cardcvv,
      coupon: coupon || null,
    });
    await payment.save();

    // 🔹 Save Order
    const order = new Order({
      orderNumber: `ORD-${Date.now()}`,
      customerName: user.name,
      phone: user.phone,
      items: products.map((p) => ({
        product: p.productInfo.name,
        quantity: p.quantity,
        price: p.productInfo.price,
      })),
      total,
      address: user.address,
      productWeight: products.reduce(
        (acc, p) => acc + (p.quantity * (p.productInfo.weight || 0)),
        0
      ),
      priority: "High", // Pay Now = High
    });
    await order.save();

    return res.json({
      message: "Payment successful & order created",
      payment,
      order,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Payment failed" });
  }
};

// 🟢 COD
export const codOrder = async (req, res) => {
  try {
    const { userId } = req.params;
    const { products, total } = req.body;

    // Validate request
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "No products provided" });
    }
    if (!total || total <= 0) {
      return res.status(400).json({ error: "Invalid total amount" });
    }

    // Fetch user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Save Order
    const order = new Order({
      orderNumber: `ORD-${Date.now()}`,
      customerName: user.name,
      phone: user.phone,
      items: products.map((p) => ({
        product: p.productInfo.name,
        quantity: p.quantity,
        price: p.productInfo.price,
      })),
      total,
      address: user.address,
      productWeight: products.reduce(
        (acc, p) => acc + (p.quantity * (p.productInfo.weight || 0)),
        0
      ),
      priority: "Low", // COD = Low
    });
    await order.save();

    return res.json({ message: "COD order placed", order });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "COD failed" });
  }
};
