// routes/cartRoutes.js
import express from "express";
import { getCartById, payNow, codOrder } from "../../controllers/Lasiru/CartController.js";

const router = express.Router();

router.get("/preview/:id", getCartById);

router.post("/:id/pay", payNow);

router.post("/:id/cod", codOrder);

export default router;
