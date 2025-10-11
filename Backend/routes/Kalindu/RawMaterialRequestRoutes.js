import express from "express";
import {
  createRequest,
  getAllRequests,
  updateRequestStatus,
  closeRequest,
  sendCustomEmail,
} from "../../controllers/Kalindu/RawMaterialRequestController.js";

const router = express.Router();

// ✅ new standalone email route
router.post("/email", sendCustomEmail);

// existing routes
router.post("/requests", createRequest);
router.get("/requests", getAllRequests);
router.put("/requests/:id/status", updateRequestStatus);
router.put("/requests/:id/close", closeRequest);

export default router;
