import express from "express";
import { confirmPayment } from "../../controllers/Lasiru/paymentController.js";

const router = express.Router();

router.post('/confirm', confirmPayment);

export default router;
