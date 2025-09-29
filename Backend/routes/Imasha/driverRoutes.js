import express from "express";
import {completeDelivery, getCompletedDeliveriesById, getDeliveriesById, getDriverById, updateDriverProfile} from "../../controllers/Imasha/driverController.js";

const router = express.Router();

router.get("/:id",getDriverById);
router.get("/delivery/:id",getDeliveriesById);
router.put("/complete/:id",completeDelivery);
router.get("/delivery/completed/:id",getCompletedDeliveriesById);
router.put("/:id",updateDriverProfile);

export default router;