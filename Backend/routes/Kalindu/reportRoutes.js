import express from "express";
import { getSupplierPerformance, getAllRequests, exportRequestPDF } from "../../controllers/Kalindu/reportController.js";

const router = express.Router();

router.get("/suppliers", getSupplierPerformance);
router.get("/requests", getAllRequests);
router.get("/export/:id", exportRequestPDF);

export default router;
