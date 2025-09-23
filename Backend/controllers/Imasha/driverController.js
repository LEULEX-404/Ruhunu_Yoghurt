import Driver from '../../models/Tharuka/Driver.js';
import AssignedDelivery from '../../models/Imasha/AssignDelivery.js';
import Delivery from '../../models/Imasha/Delivery.js';

export const getDriverById = async (req, res) =>{
    try{
        const { id } = req.params;
        const driver = await Driver.findOne({driverID : id}).populate ("employeeID","name email phone position");

        if(!driver){
            return res.status(404).json({message : "Driver not found "});
        }

        res.status(200).json(driver);
    }
    catch(err){
        res.status(500).json({message: "Error fetching Driver", error: err.message});
    }
}

export const getDeliveriesById = async (req, res) => {
    try{
        const id = req.params.id;
        const delivery = await AssignedDelivery.find({driver : id }).populate("deliveries", "orderID customerName status")

        if(!delivery || delivery.length === 0){
            return res.status(404).json({message: "No Deliveries"})
        }
        console.log(delivery)
        res.status(200).json(delivery);
    }
    catch(err){
        res.status(500).json({message : "Error fetching Delivery ",error : err.message});
    }
};

export const completeDelivery = async (req, res) => {
    try{
        const { id } = req.params;
        const delivery = await Delivery.findById(id);
        console.log("del:",delivery);

        const driver = await Driver.findOne({driverID: delivery.assignedDriver})

        if(!delivery){
            
            return res.status(404).json({message: "Delivery not found"});
        }

        if(!driver){
            return res.status(404).json({message: "Delivery not found"});
        }
         delivery.status ="completed";
         await delivery.save();

         driver.points = driver.points + 1;
         await driver.save();

         res.status(200).json({message: "Delivery marked as completed", delivery});
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: error.message});
    }
};