import express from 'express';
import { getAttendanceByRange, getDrivers, getEmployees } from '../../controllers/Tharuka/reportController.js';

const router = express.Router();

router.get('/employees',getEmployees);
router.get('/drivers',getDrivers);
router.get('/attendance',getAttendanceByRange);

export default router;