import express from "express";
import { getHistory, exportHistoryPDF } from "../../controllers/Kalindu/RawMaterialHistoryController.js";

const router = express.Router();


router.get("/", getHistory);

router.get("/export", exportHistoryPDF);

export default router;
