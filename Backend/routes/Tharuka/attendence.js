import express from 'express';
import { getTodaysAttendence, checkIn, earlyLeave, getAllTodaysAttendance,getAttendanceSummary, getAttendanceByDate } from '../../controllers/Tharuka/attendenceController.js';
import { authMiddleware } from '../../middleware/auth.js';

const router = express.Router();

router.get('/today', authMiddleware, getTodaysAttendence);
router.post('/checkin', authMiddleware, checkIn);
router.post('/earlyleave', authMiddleware, earlyLeave);
router.get('/today/attendence', authMiddleware, getAllTodaysAttendance);
router.get('/summary', getAttendanceSummary);

router.get('/bydate', authMiddleware, getAttendanceByDate);


export default router;