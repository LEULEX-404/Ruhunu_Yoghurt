import express from 'express';
import { getProduct, saveProduct, updateProduct } from '../../controllers/Pathum/productController.js';

const productRouter = express.Router();

productRouter.post("/", saveProduct);
productRouter.get("/", getProduct);
productRouter.get("/:productId", updateProduct)

export default productRouter;