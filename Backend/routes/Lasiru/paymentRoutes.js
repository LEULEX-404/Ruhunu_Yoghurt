// routes/paymentRoutes.js
import express from "express";
import { payNow, codOrder, getAllPayments, getPaymentById, updatePaymentStatus } from "../../controllers/Lasiru/paymentController.js";
const router = express.Router();

router.post("/paynow/:userId", payNow);
router.post("/cod/:userId", codOrder);
router.get("/", getAllPayments);
router.get("/:id", getPaymentById);
router.patch("/:id/status", updatePaymentStatus);

export default router;
