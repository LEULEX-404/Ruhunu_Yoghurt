import express from "express";
import {
  addRawMaterial,
  getAllRawMaterials,
  getRawMaterialById,
  updateRawMaterial,
  deleteRawMaterial,
  increaseQuantity,
  decreaseQuantity
} from "../../controllers/Kalindu/RawmaterialController.js";

const router = express.Router();

router.post("/", addRawMaterial);
router.get("/", getAllRawMaterials);
router.get("/:id", getRawMaterialById);
router.put("/:id", updateRawMaterial);
router.delete("/:id", deleteRawMaterial);

router.put("/increase/:id", increaseQuantity);
router.put("/decrease/:id", decreaseQuantity);

export default router;
