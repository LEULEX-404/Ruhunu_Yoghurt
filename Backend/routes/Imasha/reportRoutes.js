import express from "express";
import { dailyCompleted, driverPerformance, pendingDeliveries, revenueSummary } from "../../controllers/Imasha/reportController.js";

const router = express.Router();

router.get("/completed-daily",dailyCompleted);
router.get("/pending",pendingDeliveries);
router.get("/driver-performance",driverPerformance);
router.get("/revenue-summary",revenueSummary);

export default router;
