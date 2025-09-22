import express from 'express';
import { deleteProduct, getProduct, saveProduct, updateProduct } from '../../controllers/Pathum/productController.js';

const productRouter = express.Router();

productRouter.post("/", saveProduct);
productRouter.get("/", getProduct);
productRouter.put("/:productId", updateProduct)
productRouter.delete("/:productId", deleteProduct)

export default productRouter;