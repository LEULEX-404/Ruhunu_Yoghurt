import express from "express";
import {
  createRequest,
  getAllRequests,
  updateRequestStatus,
  closeRequest,
  sendCustomEmail,
} from "../../controllers/Kalindu/RawMaterialRequestController.js";

const router = express.Router();


router.post("/email", sendCustomEmail);


router.post("/requests", createRequest);
router.get("/requests", getAllRequests);
router.put("/requests/:id/status", updateRequestStatus);
router.put("/requests/:id/close", closeRequest);

export default router;
