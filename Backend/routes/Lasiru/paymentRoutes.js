import express from "express";
import { payNow, codOrder } from "../../controllers/Lasiru/paymentController.js";

const router = express.Router();

// Pay Now
router.post("/paynow/:userId", payNow);

// COD
router.post("/cod/:userId", codOrder);

export default router;
