import Delivery from '../../models/Imasha/Delivery.js';
import { getCoordinates, getDrivingDistance } from '../../utils/distance.js';
import Order from '../../models/order.js';
import AssignedDelivery from '../../models/Imasha/AssignedDelivery.js';

const WAREHOUSE_LOCATION = { lat:7.0412, lng:80.1289};

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
            location:order.location,
            productWeight: order.productWeight,
            distanceKm,
            cost
        });

        await delivery.save();

        res.status(201).json(delivery);
    } 
    catch (error){
        console.error(error);
        res.status(400).json({message: error.message});
    }
};




export const getDeliveries = async (req, res) => {
    try{
        const deliveries = await Delivery.find().populate("assignedDriver","name email");
        res.json(deliveries);
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
};



export const completeDelivery = async (req, res) => {
    try{
        const delivery = await Delivery.findById(req.params.id);
        if(!delivery) 
            return res.status(404).json({message: "Delivery not found"})
            
        delivery.status = "delivered";
        await delivery.save();

        res.json({message: "Delivery completed successfully",delivery})
    }
    catch(error){
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
        const assignDeliveries = await AssignedDelivery.find({})
        .populate("driver")
        .populate("deliveries")

        res.status(200).json(assignDeliveries)
    }
    catch(error)
    {
        console.error(error);
        res.status(500).json({message: error.message});
    }
};


