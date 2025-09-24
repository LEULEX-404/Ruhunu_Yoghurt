import express from 'express';
import { addRating, deleteProduct, getProduct, getProductById, saveProduct, updateProduct } from '../../controllers/Pathum/productController.js';

const productRouter = express.Router();

productRouter.post("/", saveProduct);
productRouter.get("/", getProduct);
productRouter.put("/:productId", updateProduct)
productRouter.delete("/:productId", deleteProduct)
productRouter.post("/add-rating", addRating)
productRouter.get("/:productId", getProductById)

export default productRouter;