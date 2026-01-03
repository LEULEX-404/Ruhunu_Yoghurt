import express from 'express';
import { authMiddleware } from '../../middleware/auth.js';
import { addDamage, getAllDamages } from '../../controllers/Pathum/damageController.js';

const damageProductRouter = express.Router()

damageProductRouter.post("/add", authMiddleware, addDamage)
damageProductRouter.get("/", authMiddleware, getAllDamages)

export default damageProductRouter;