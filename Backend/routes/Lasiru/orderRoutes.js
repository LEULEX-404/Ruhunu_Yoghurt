import express from "express";
import { getAllOrders,approveOrder, cancelOrder } from "../../controllers/Lasiru/orderController.js";

const router = express.Router();

// GET all orders
router.get("/", getAllOrders);

// Approve order
router.put("/:id/approve", approveOrder);

// Cancel order
router.put("/:id/cancel", cancelOrder);

export default router;
