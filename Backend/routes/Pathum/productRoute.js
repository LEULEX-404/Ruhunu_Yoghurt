import express from 'express';
import { getProduct, saveProduct } from '../../controllers/Pathum/productController.js';

const productRouter = express.Router();

productRouter.post("/", saveProduct)
productRouter.get("/", getProduct);

export default productRouter;