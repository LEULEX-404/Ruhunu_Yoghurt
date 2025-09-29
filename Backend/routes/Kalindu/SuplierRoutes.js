import express from "express";
import { 
  addSupplier, 
  getAllSuppliers, 
  getSupplierById, 
  updateSupplier, 
  deleteSupplier,
  rateSupplier  
} from "../../controllers/Kalindu/SuplierController.js";

const router = express.Router();

router.post("/", addSupplier);        
router.get("/", getAllSuppliers);     
router.get("/:id", getSupplierById);  
router.put("/:id", updateSupplier);   
router.delete("/:id", deleteSupplier);
router.post("/:id/rate", rateSupplier);

export default router;

