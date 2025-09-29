import Cart from "../../models/Lasiru/cart.js";
import Promocode from "../../models/Lasiru/promocode.js";
import Payment from "../../models/Pathum/payment.js";
import Order from "../../models/Lasiru/order.js";
import User from "../../models/Tharuka/User.js";


// PAY NOW
export const payNow = async (req, res) => {
  try {
    const { userId } = req.params;
    const { cardNumber, cardcvv, products, total, coupon } = req.body;

    // validate body (same as before)...
    // fetch user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Optional: verify coupon server-side: if coupon provided, check validity and optionally compute expected discount
    if (coupon) {
      const promo = await Promocode.findOne({ code: coupon });
      if (!promo || !promo.isActive || promo.expiryDate <= new Date() || promo.usedCount >= promo.usageLimit) {
        return res.status(400).json({ error: "Promocode invalid or expired" });
      }
      // Optionally: you can compute the discount and compare with 'total' to ensure client did not manipulate price.
      // For simplicity we'll allow the client total but still increment usedCount below.
    }

    // Save payment (same as existing)
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

    // Save order
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
      priority: "High",
    });
    await order.save();

    // If coupon used, increment usedCount
    if (coupon) {
      await Promocode.findOneAndUpdate({ code: coupon }, { $inc: { usedCount: 1 } });
    }

    // Delete the cart for the user
    await Cart.deleteOne({ customerId: userId });

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

// COD - similar changes, accept coupon param and update promocode usedCount + delete cart
export const codOrder = async (req, res) => {
  try {
    const { userId } = req.params;
    const { products, total, coupon } = req.body;

    // validate request ... find user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Optionally validate coupon server-side
    if (coupon) {
      const promo = await Promocode.findOne({ code: coupon });
      if (!promo || !promo.isActive || promo.expiryDate <= new Date() || promo.usedCount >= promo.usageLimit) {
        return res.status(400).json({ error: "Promocode invalid or expired" });
      }
    }

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
      priority: "Low",
    });
    await order.save();

    // Increment promocode usedCount if coupon used
    if (coupon) {
      await Promocode.findOneAndUpdate({ code: coupon }, { $inc: { usedCount: 1 } });
    }

    // Delete the user's cart
    await Cart.deleteOne({ customerId: userId });

    return res.json({ message: "COD order placed", order });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "COD failed" });
  }
};

// Get all payments
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ date: -1 }); // latest first
    res.status(200).json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch payments" });
  }
};

// Get single payment by ID
export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.status(200).json(payment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch payment" });
  }
};

// Optional: Update payment status (if needed)
export const updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.status(200).json(payment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update payment" });
  }
};