import express from "express";
import RawMaterial from "../../models/Kalindu/Rawmaterial.js";
import RawMaterialRequest from "../../models/Kalindu/RawMaterialRequest.js";

const router = express.Router();

// Get stock dashboard stats
router.get("/stats", async (req, res) => {
  try {
    const totalStocks = await RawMaterial.countDocuments();
    const lowStocks = await RawMaterial.countDocuments({ quantity: { $lt: 100 } }); 
    const pendingRequests = await RawMaterialRequest.countDocuments({ status: "Pending" });
    const completedRequests = await RawMaterialRequest.countDocuments({ status: "Delivered" });

    res.json({
      totalStocks,
      lowStocks,
      pendingRequests,
      completedRequests,
    });
  } catch (error) {
    console.error("Error fetching stock stats:", error);
    res.status(500).json({ message: "Error fetching stock stats", error });
  }
});

export default router;
