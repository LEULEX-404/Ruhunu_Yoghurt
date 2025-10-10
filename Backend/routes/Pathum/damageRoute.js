import express from 'express';
import { authMiddleware } from '../../middleware/auth.js';
import { addDamage } from '../../controllers/Pathum/damageController.js';

const damageProductRouter = express.Router()

damageProductRouter.post("/", authMiddleware, addDamage)

export default damageProductRouter;