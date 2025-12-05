import express from 'express'
import { addPayment, getAllPayments } from '../../controllers/Pathum/paymentController.js';
import { authMiddleware } from '../../middleware/auth.js';

const paymentRouter = express.Router();

paymentRouter.post("/", authMiddleware, addPayment)
paymentRouter.get("/", authMiddleware, getAllPayments)

export default paymentRouter