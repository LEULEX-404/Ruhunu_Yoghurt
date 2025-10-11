import express from "express";
import User from '../../models/Tharuka/User.js';
import Order from '../../models/Lasiru/order.js';
import nodemailer from 'nodemailer';

const router = express.Router();

router.put("/:id/cancel", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    // Look up user by name (risky)
   const user = await User.findOne({ name: { $regex: `^${order.customerName.trim()}$`, $options: 'i' } });
    if (!user) return res.status(404).json({ error: "User email not found" });

     if (!user) {
      console.log("User not found for customerName:", order.customerName);
      return res.status(404).json({ 
        error: "User email not found",
        customerName: order.customerName
      });
    }

    console.log("User found:", user);
    console.log("User email:", user.email);

    // Cancel the order
    order.status = "cancelled";
    await order.save();

    // Send email
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"RUHUNU Yoghurt" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `Order ${order.orderNumber} Cancelled`,
      text: `Hello ${order.customerName},

      Your order ${order.orderNumber} has been cancelled.
      The payment of Rs.${order.total} will be refunded to you shortly.

      Thank you,
      RUHUNU Yoghurt`,
    });

    res.json({ success: true, message: "Order cancelled & email sent." , customerEmail: user.email});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to cancel order" });
  }
});

export default router;
