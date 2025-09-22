import Driver from '../../models/Tharuka/Driver.js';
import AssignDelivery from '../../models/Imasha/AssignDelivery.js';

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
        const delivery = await AssignDelivery.find({driver : id })

        if(!delivery || delivery.length === 0){
            return res.status(404).json({message: "No Deliveries"})
        }
        res.status(200).json(delivery);
    }
    catch(err){
        res.status(500).json({message : "Error fetching Delivery ",error : err.message});
    }
};