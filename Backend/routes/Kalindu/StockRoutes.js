import express from "express";
import { getAllProducts, increaseQuantity, decreaseQuantity } from "../../controllers/Kalindu/StockController.js";

const router = express.Router();

// Stock manager routes
router.get("/products", getAllProducts); 
router.put("/products/:productId/increase", increaseQuantity); 
router.put("/products/:productId/decrease", decreaseQuantity); 

export default router;
