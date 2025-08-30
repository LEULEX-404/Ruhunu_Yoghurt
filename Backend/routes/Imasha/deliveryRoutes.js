import express from `express`;
import {createDelivery, getDeliveries, compleateDelivery, getPendingOrders, getAssignDeliveries} from "../../controllers/Imasha/deliveryController.js";
import {assignDelivery, getDeliveriesandDrivers} from "../../controllers/Imasha/assignDriverController.js";

const router = express.Router();

router.post("/create",createDelivery);
router.get("/",getDeliveries);
router.get("/pending",getPendingOrders);
router.post("/assign",assignDelivery);
router.get("/assign",getDeliveriesandDrivers);
router.put("/:id/complete",compleateDelivery);
router.get("/deliveries",getAssignDeliveries);