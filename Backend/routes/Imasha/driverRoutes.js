import express from "express";
import {getDriverById} from "../../controllers/Imasha/driverController.js";

const router = express.Router();

router.get("/:id",getDriverById);

export default router;