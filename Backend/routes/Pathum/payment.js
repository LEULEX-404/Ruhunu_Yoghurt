import express from 'express'
import { addPayment } from '../../controllers/Pathum/paymentController.js';
import { authMiddleware } from '../../middleware/auth.js';

const paymentRouter = express.Router();

paymentRouter.post("/", authMiddleware, addPayment)

export default paymentRouter