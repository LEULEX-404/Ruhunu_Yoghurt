import express from 'express';
import { getTodaysAttendence, checkIn, earlyLeave } from '../../controllers/Tharuka/attendenceController.js';
import { authMiddleware } from '../../middleware/auth.js';

const router = express.Router();

router.get('/today', authMiddleware, getTodaysAttendence);
router.post('/checkin', authMiddleware, checkIn);
router.post('/earlyleave', authMiddleware, earlyLeave);

export default router;