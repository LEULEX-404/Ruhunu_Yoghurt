import express from 'express';
import { updateUser } from '../../controllers/Tharuka/userController.js';

const router = express.Router();

router.put("/update/:id",updateUser);

export default router;