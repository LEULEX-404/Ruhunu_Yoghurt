import express from 'express';
import {createDelivery, getPendingOrders,getAssignDeliveries, getSearchOrder, searchDeliveriesAndDrivers} from "../../controllers/Imasha/deliveryController.js";
import {assignDelivery, getDeliveriesandDrivers} from "../../controllers/Imasha/assignDriverController.js";

const router = express.Router();

router.post("/create",createDelivery);
router.get("/pending",getPendingOrders);
router.post("/assign",assignDelivery);
router.get("/assign",getDeliveriesandDrivers);
router.get("/deliveries",getAssignDeliveries);
router.get("/search/orders", getSearchOrder);
router.get("/search/deliveries", searchDeliveriesAndDrivers);

export default router;