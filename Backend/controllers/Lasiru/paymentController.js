import Payment from "../../models/Pathum/payment.js";
import Order from "../../models/Lasiru/order.js";
import Cart from "../../models/Lasiru/cart.js";
import { v4 as uuidv4 } from "uuid";

export const confirmPayment = async (req, res) => {
    try {
      const { name, email, phone, address, items, total, paymentMode, cardNumber, cardcvv, promocode } = req.body;
  
      if (!name || !email || !items || !total) {
        return res.status(400).json({ error: "Missing payment details" });
      }
  
      const paymentId = uuidv4();
  
      // Save in payments collection
      const payment = new Payment({
        paymentId,
        name,
        email,
        phone,
        address,
        products: items.map(it => ({
          productInfo: {
            productId: it.productId,
            name: it.name,
            labelledPrice: it.price,
            price: it.price,
          },
          quantity: it.quantity
        })),
        total,
        paymentMode,
        cardNumber,
        cardcvv,
        coupon: promocode || null
      });
  
      await payment.save();
  
      // Save in orders collection
      const orderNumber = 'ORD-' + Math.floor(Math.random() * 1000000);
      const order = new Order({
        orderNumber,
        customerName: name,
        phone,
        address,
        items: items.map(it => ({ product: it.name, quantity: it.quantity, price: it.price })),
        total,
        status: "Completed",
        productWeight: items.reduce((sum, it) => sum + (it.weight ?? 0) * it.quantity, 0)
      });
  
      await order.save();
  
      res.json({ message: "Payment successful", paymentId, orderId: order._id });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  };