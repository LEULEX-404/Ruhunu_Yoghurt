import express from "express";
import { payNow, codOrder, getAllPayments, getPaymentById, updatePaymentStatus } from "../../controllers/Lasiru/paymentController.js";

const router = express.Router();

// Pay Now
router.post("/paynow/:userId", payNow);

// COD
router.post("/cod/:userId", codOrder);

// GET all payments
router.get("/", getAllPayments);

// GET payment by ID
router.get("/:id", getPaymentById);

// PUT update payment status (optional)
router.put("/:id/status", updatePaymentStatus);

export default router;
