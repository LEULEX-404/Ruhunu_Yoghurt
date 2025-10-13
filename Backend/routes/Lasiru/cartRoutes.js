import express from "express";
import { applyPromocodeToCart, getCartByUser} from "../../controllers/Lasiru/CartController.js";
const router = express.Router();

router.get("/preview/:userId", getCartByUser);
router.post("/apply-promocode/:userId", applyPromocodeToCart);

export default router;
