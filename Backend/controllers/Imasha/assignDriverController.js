import Driver from "../../models/Tharuka/Driver.js";
import Delivery from "../../models/Imasha/Delivery.js";
import AssignedDelivery from "../../models/Imasha/AssignDelivery.js";

export const assignDelivery = async (req, res)=>{
    try{
        const { driverId, deliveryIds} = req.body;

        const driver = await Driver.findById(driverId);
        const deliveries = await Delivery.find({_id:{$in:deliveryIds}});
        //_id = onject Id   $in =get one by one 

        if(!driver || deliveries.length === 0)
        {
            return res.status(404).json({message:"Driver or Delivery notFound."});
        }

        let newDeliveriesWeight = 0;
        deliveries.forEach(d=>{
            newDeliveriesWeight = newDeliveriesWeight + d.productWeight;
        });

        let assigned = await AssignedDelivery.findOne({driver:driverId})
        if(!assigned){
            if(newDeliveriesWeight > driver.vehicleCapacity){
                return res.status(400).json({message: "Cannot assigned: Exceeds vehicle capacity"});
            }

            assigned = new AssignedDelivery({
                driver: driverId,
                deliveries: deliveryIds,
                totalWeight: newDeliveriesWeight,
            })
            await assigned.save();
        }
        else{
            const updateWeight = assigned.totalWeight + newDeliveriesWeight;

            if(updateWeight > driver.vehicleCapacity)
            {
                return res.status(400).json({message: "cannot assign: Exceeds vehicle capacity"});

            }
            assigned.deliveries.push(...deliveryIds);
            assigned.totalWeight = updateWeight;
            await assigned.save();
        }

            await Delivery.updateMany(
                {_id:{$in:deliveryIds}},
                {assignedDriver: driverId, status: "assigned"}
            );

            const allAssignedDeliveries = await Delivery.find({assignedDriver: driverId})

            if(allAssignedDeliveries.length > 0){
                const current = allAssignedDeliveries.reduce((max,d)=>
                    d.distanceKm > max.distanceKm ? d:max,allAssignedDeliveries[0]
                );
                driver.currentLocation = current.address;
                await driver.save();
            }
            res.json({
                message: "Delivery assigned Successfully",
                assigned,
                currentLocation: driver.currentLocation,
            });
        }
    
    catch(err){
            res.status(500).json({error: err.message})
    }
}

export const getDeliveriesandDrivers = async (req,res)=>{
    try{
        const Deliveries = await Delivery.find ({status: "pending"});
        const Drivers = await Driver.find({availability: true});

        res.json({
            Deliveries,
            Drivers
        });
    }
    catch(err){
        res.status(500).json({erroe: err.message});
    }
}