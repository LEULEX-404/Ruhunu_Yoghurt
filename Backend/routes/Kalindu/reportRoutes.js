import express from "express";
import {
  getSupplierPerformance,
  getAllRequests,
  exportRequestPDF,
} from "../../controllers/Kalindu/ReportController.js";

const router = express.Router();

// Supplier performance summary
router.get("/suppliers", getSupplierPerformance);

// All requests
router.get("/requests", getAllRequests);

// Export PDF
router.get("/export/:id", exportRequestPDF);

export default router;
