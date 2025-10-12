import express from "express";
import {
  createRequest,
  getAllRequests,
  updateRequestStatus,
  closeRequest,
} from "../../controllers/Kalindu/RawMaterialRequestController.js";

const router = express.Router();

// Create new request + send email
router.post("/requests", createRequest);

// Get all requests
router.get("/requests", getAllRequests);

// Update request status (approve / reject / deliver)
router.put("/requests/:id/status", updateRequestStatus);

// Close request (mark as delivered)
router.put("/requests/:id/close", closeRequest);

export default router;
