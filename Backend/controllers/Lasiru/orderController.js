import Order from "../../models/Lasiru/order.js";

export const getAllOrders = async (req, res) => {
  try {
    const { q, status } = req.query;

    const query = {};

    if (status) {
      const statuses = status.split(",").map(s => s.trim().toLowerCase());
      query.status = { $in: statuses.map(s => new RegExp(`^${s}$`, "i")) };
    }

    if (q) {
      const regex = new RegExp(q.trim(), "i");
      query.$or = [
        { customerName: regex },
        { orderNumber: regex }
      ];
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const approveOrder = async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) return res.status(404).json({ error: "Order not found" });
  
      if (order.status !== "pending")
        return res.status(400).json({ error: "Only pending orders can be approved" });
  
      order.status = "approved";
      await order.save();
      res.status(200).json({ message: "Order approved successfully", order });
    } catch (err) {
      res.status(500).json({ error: "Failed to approve order" });
    }
  };

  export const cancelOrder = async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) return res.status(404).json({ error: "Order not found" });
  
      if (order.status !== "pending")
        return res.status(400).json({ error: "Only pending orders can be cancelled" });
  
      order.status = "cancelled";
      await order.save();
      res.status(200).json({ message: "Order cancelled successfully", order });
    } catch (err) {
      res.status(500).json({ error: "Failed to cancel order" });
    }
  };