import express from "express";
import {completeDelivery, getDeliveriesById, getDriverById} from "../../controllers/Imasha/driverController.js";

const router = express.Router();

router.get("/:id",getDriverById);
router.get("/delivery/:id",getDeliveriesById);
router.put("/complete/:id",completeDelivery);

export default router;