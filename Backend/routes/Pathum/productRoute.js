import express from 'express';
import { addRating, deleteProduct, getDashboardStats, getProduct, getProductById, saveProduct, searchProducts, updateProduct } from '../../controllers/Pathum/productController.js';
import { authMiddleware } from '../../middleware/auth.js';


const productRouter = express.Router();

productRouter.post("/", authMiddleware, saveProduct);
productRouter.get("/public",  getProduct);//user
productRouter.get("/", authMiddleware, getProduct);//admin
productRouter.put("/:productId", authMiddleware, updateProduct)
productRouter.delete("/:productId", authMiddleware, deleteProduct)
productRouter.post("/add-rating", addRating)
productRouter.get("/search/:query", searchProducts)
productRouter.get("/admin", authMiddleware, getDashboardStats)
productRouter.get("/:productId", getProductById)

export default productRouter;