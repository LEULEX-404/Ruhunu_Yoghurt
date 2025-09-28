// routes/cartRoutes.js
import express from "express";
import { getCartByUser } from "../../controllers/Lasiru/CartController.js";

const router = express.Router();

// ✅ now fetch cart with userId instead of cartId
router.get("/preview/:userId", getCartByUser);


export default router;
