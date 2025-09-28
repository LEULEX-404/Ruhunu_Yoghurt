import express from "express";
import { addToCart, clearCart, getCart, removeFromCart } from "../../controllers/Pathum/cartController.js";


const cartRouter = express.Router();

// POST /api/cart/add
cartRouter.post("/add", addToCart);

// POST /api/cart/remove
cartRouter.post("/remove", removeFromCart);

// POST /api/cart/clear
cartRouter.post("/clear", clearCart);

// GET /api/cart/:customerId
cartRouter.get("/:customerId", getCart);

export default cartRouter