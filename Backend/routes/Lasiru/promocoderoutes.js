import express, { Router } from "express";
// Import the request handler
import { addpromocode, getAllPromocodes, getPromocodeById, updatePromocode, deletePromocode } from "../../controllers/Lasiru/promocodecontroller.js";
// Create a new router object
const router = express.Router();

// Add a new promo code
router.post("/add",addpromocode);

//get all promo codes
router.get("/",getAllPromocodes);

//get a promo code by ID
router.get("/:id",getPromocodeById);

//update promocode by ID
router.put("/update/:id", updatePromocode);

//delete promocode by ID
router.delete("/delete/:id", deletePromocode);


export default router;