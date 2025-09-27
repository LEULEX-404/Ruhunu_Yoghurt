import express from 'express';
import { addRating, deleteProduct, getProduct, getProductById, saveProduct, searchProducts, updateProduct } from '../../controllers/Pathum/productController.js';
import { authMiddleware } from '../../middleware/auth.js';


const productRouter = express.Router();

productRouter.post("/", authMiddleware, saveProduct);
productRouter.get("/", authMiddleware, getProduct);
productRouter.put("/:productId", authMiddleware, updateProduct)
productRouter.delete("/:productId", authMiddleware, deleteProduct)
productRouter.post("/add-rating", addRating)
productRouter.get("/search/:query", searchProducts)
productRouter.get("/:productId", getProductById)

export default productRouter;