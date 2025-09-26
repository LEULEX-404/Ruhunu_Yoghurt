import Delivery from '../../models/Imasha/Delivery.js';
import Driver from '../../models/Tharuka/Driver.js';
import { getCoordinates, getDrivingDistance } from '../../utils/distance.js';
import Order from '../../models/Lasiru/order.js';
import AssignedDelivery from '../../models/Imasha/AssignDelivery.js';
import Employee from '../../models/Tharuka/Employee.js';

const WAREHOUSE_LOCATION = { lat:7.0412, lng:80.1289};

export const getManagerById = async (req, res) => {
    try{
        const { id } = req.params;

        const manager = await Employee.findById(id);

        if(!manager){
            return res.status(404).json({message: "Manager not Found."})
        }
        res.status(200).json(manager);
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Error fetching manager.",error: err.message});
    }
}

export const createDelivery = async (req,res) =>{
    try{
        const { orderNumber } = req.body;
 
        const order = await Order.findOne({ orderNumber});

        if(!order){
            return res.status(404).json({message:"Order not found."})
        }

        const to = await getCoordinates(order.address)

        const distanceKm = await getDrivingDistance(WAREHOUSE_LOCATION, to);

        const baseRate = 50;
        const ratePerKm = 10;
        const ratePerKg = 5;
        
        const cost = baseRate + distanceKm * ratePerKm + order.productWeight * ratePerKg;

        const delivery = new Delivery({
            orderID: order.orderNumber,
            customerName: order.customerName,
            address:order.address,
            productWeight: order.productWeight,
            distanceKm,
            cost
        });
        order.status = "Ready to Assign";
        await order.save();
        await delivery.save();

        res.status(201).json(delivery);
    } 
    catch (error){
        console.error(error);
        res.status(400).json({message: error.message});
    }
};

export const getPendingOrders = async (req, res) =>{
    try{
        const pendingOrders = await Order.find({ status: "pending"}).select ("orderNumber customerName items total address productWeight");

        res.status(200).json(pendingOrders);
    }
    catch(error){
        console.error(error)
        res.status(500).json({ message: error.message });
    }

};

export const getAssignDeliveries = async (req,res) =>{
    try{
        const assignDeliveries = await AssignedDelivery.find({
            status: { $in: ["assigned", "sceduled"] } 
        })
        .populate({
            path: "driver",
            model: "Driver",
            match: {},
            select: "name vehicleCapacity currentLocation",
            localField: "driver",
            foreignField: "driverID"
        })
        .populate("deliveries", "orderID customerName address cost");

        res.status(200).json(assignDeliveries)
    }
    catch(error)
    {
        console.error(error);
        res.status(500).json({message: error.message});
    }
};

export const getCompletedDeliveries = async (req,res) =>{
    try{
        const assignDeliveries = await AssignedDelivery.find({
            status: { $in: ["completed"] } 
        })
        .populate({
            path: "driver",
            model: "Driver",
            match: {},
            select: "name vehicleCapacity currentLocation",
            localField: "driver",
            foreignField: "driverID"
        })
        .populate("deliveries", "orderID customerName address cost");

        res.status(200).json(assignDeliveries)
    }
    catch(error)
    {
        console.error(error);
        res.status(500).json({message: error.message});
    }
};


export const getSearchOrder = async (req, res) =>{
    try{
        const search = req.query.search || "";

        let query = { status: "pending"};

        if(search){
            query.$or = [
                {customerName: {$regex: search, $options: "i"}},
                {orderNumber: {$regex: search, $options: "i"}},
                {address: {$regex: search, $options: "i"}}
            ]
        };

            const pendingOrders = await Order.find(query).select(
            "orderNumber customerName items total address productWeight"
            );
 
        res.json(pendingOrders);
    }catch(err){
        res.status(500).json({error: err.message});
    }
};


export const searchDeliveriesAndDrivers = async (req,res) =>{
    try{
        const { search } = req.query;

        let deliveries = [];
        let drivers = [];

        if(search){
        const query  = search ? { $regex: search, $options: "i"} : {};
        const isNumeric = !isNaN(search);

        let deliveryconditon = [
                {customerName: query},
                {orderID: query},
                {address: query},
            ];

        if(isNumeric){
            deliveryconditon.push({
                productWeight: Number(search)
            });
        }

        deliveries = await Delivery.find({
            status: "pending",
            $or: deliveryconditon
        });

        const driverQuery = {
            availability: true,
            $or: [
                {name: query},
                {currentLocation: query}
            ]
        };

        const rawDrivers = await Driver.find(driverQuery);
        drivers = await Promise.all(rawDrivers.map(async (driver) => {
            const assigned = await AssignedDelivery.find({
                driver: driver.driverID,
                status: { $in: ["assigned", "sceduled"] }
            });

            const totalWeight = assigned.reduce(
                (sum,ad) => sum + (ad.totalWeight || 0),
                0
            );
            const remainingCapacity = driver.vehicleCapacity - totalWeight;

            return {
                ...driver.toObject(),
                assignedWeight: totalWeight,
                remainingCapacity
            };
        }))
    }else{
        deliveries = await Delivery.find({status: "pending"});
        const rawDrivers = await Driver.find({availability: true});

        drivers = await Promise.all(rawDrivers.map(async (driver) => {
            const assigned = await AssignedDelivery.find({
                driver: driver.driverID,
                status: { $in: ["assigned", "sceduled"] }
            });
            const totalWeight = assigned.reduce(
                (sum,ad) => sum + (ad.totalWeight || 0),
                0
            );
            const remainingCapacity = driver.vehicleCapacity - totalWeight;

            return {
                ...driver.toObject(),
                assignedWeight: totalWeight,
                remainingCapacity
            };
        }))
    }
        res.json({Deliveries: deliveries, Drivers: drivers});
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
};

export const searchAssignedDeliveries = async (req,res) =>{
    try{
        const { search } = req.query;
        let assignedDeliveries = [];
        if(search){
        const query  = search ? { $regex: search, $options: "i"} : {};
        const isNumeric = !isNaN(search);

        let pipeline = [
      { $match: { status: "sceduled" } },
      {
        $lookup: {
          from: "deliveries",
          localField: "deliveries",
          foreignField: "_id",
          as: "deliveries"
        }
    },{
         $lookup: {
          from: "drivers",
          localField: "driver",
          foreignField: "driverID",
          as: "drivers"
        }
      }
    ];

        let assignedconditon = [
                {"deliveries.orderID": query},
                {"deliveries.customerName": query},
                {"drivers.name": query},
                {"drivers.currentLocation": query},
            ];

        if(isNumeric){
            assignedconditon.push({
                productWeight: Number(search)
            });
        }
        pipeline.push({ $match: { $or: assignedconditon } });

        assignedDeliveries = await AssignedDelivery.aggregate(pipeline);
    }
    console.log(assignedDeliveries);
        res.json(assignedDeliveries);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
};


export const reorderDelivery = async (req, res) => {
  try {
    const { id } = req.params;

    const delivery = await Delivery.findById(id);
    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    const order = await Order.findOne({ orderNumber: delivery.orderID });
    if (!order) {
      return res.status(404).json({ message: "Related order not found" });
    }

    order.status = "pending";
    await order.save();

    await Delivery.findByIdAndDelete(id);

    res.json({ message: "Re-order successful!", order, delivery });
  } catch (err) {
    console.error("Reorder error:", err);
    res.status(500).json({ message: "Server error" });
  }
};