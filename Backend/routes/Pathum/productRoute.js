import express from 'express';
import { saveProduct } from '../../controllers/Pathum/productController.js';

const productRouter = express.Router();

productRouter.post("/", saveProduct)

export default productRouter;