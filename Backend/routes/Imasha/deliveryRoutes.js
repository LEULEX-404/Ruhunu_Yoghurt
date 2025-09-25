import express from 'express';
import {createDelivery, getPendingOrders,getAssignDeliveries, getSearchOrder, searchDeliveriesAndDrivers, getManagerById, searchAssignedDeliveries, getCompletedDeliveries} from "../../controllers/Imasha/deliveryController.js";
import {assignDelivery, getDeliveriesandDrivers, getStats, scheduleAssignedDelivery} from "../../controllers/Imasha/assignDriverController.js";

const router = express.Router();

router.get("/manager/:id",getManagerById);
router.post("/create",createDelivery);
router.get("/pending",getPendingOrders);
router.post("/assign",assignDelivery);
router.get("/assign",getDeliveriesandDrivers);
router.get("/deliveries",getAssignDeliveries);
router.get("/deliveries/completed",getCompletedDeliveries);
router.get("/search/orders", getSearchOrder);
router.get("/search/deliveries", searchDeliveriesAndDrivers);
router.get("/search/assigned",searchAssignedDeliveries);
router.post("/schedule", scheduleAssignedDelivery);
router.get("/stats",getStats);

export default router;