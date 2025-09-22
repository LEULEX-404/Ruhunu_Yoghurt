import express from "express";
import {getDeliveriesById, getDriverById} from "../../controllers/Imasha/driverController.js";

const router = express.Router();

router.get("/:id",getDriverById);
router.get("/delivery/:id",getDeliveriesById);

export default router;