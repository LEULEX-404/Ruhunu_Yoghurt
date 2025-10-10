import express from "express";

import { 
  addRawMaterial, 
  getAllRawMaterials, 
  getRawMaterialById, 
  updateRawMaterial, 
  deleteRawMaterial,
  increaseQuantity,   // ✅ import here
  decreaseQuantity 
}from "../../controllers/Kalindu/RawmaterialController.js";

const router = express.Router();

// ➕ Add new raw material
router.post("/", addRawMaterial);

// 📋 Get all raw materials
router.get("/", getAllRawMaterials);

// 🔍 Get a single raw material by ID
router.get("/:id", getRawMaterialById);

// ✏️ Update raw material
router.put("/:id", updateRawMaterial);

// ❌ Delete raw material
router.delete("/:id", deleteRawMaterial);

router.put("/:id/increase", increaseQuantity); 

router.put("/:id/decrease", decreaseQuantity); 






export default router;
