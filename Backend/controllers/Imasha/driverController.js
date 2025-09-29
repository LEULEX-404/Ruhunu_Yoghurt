import Driver from '../../models/Tharuka/Driver.js';
import AssignedDelivery from '../../models/Imasha/AssignDelivery.js';
import Delivery from '../../models/Imasha/Delivery.js';
import Employee from '../../models/Tharuka/Employee.js';
import Order from '../../models/Lasiru/order.js';

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
        const delivery = await AssignedDelivery.find({driver : id,status: "sceduled" }).populate("deliveries", "orderID customerName status")

        if(!delivery || delivery.length === 0){
            return res.status(200).json([]); 
        }
        console.log(delivery)
        res.status(200).json(delivery);
    }
    catch(err){
        res.status(500).json({message : "Error fetching Delivery ",error : err.message});
    }
};

export const getCompletedDeliveriesById = async (req, res) => {
    try{
        const id = req.params.id;
        const delivery = await AssignedDelivery.find({driver : id,status: "completed" }).populate("deliveries", "orderID customerName status")

        if(!delivery || delivery.length === 0){
            res.status(200).json(delivery);
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
            return res.status(404).json({message: "driver not found"});
        }
         delivery.status ="completed";
         await delivery.save();

         driver.points = driver.points + 1;
         await driver.save();


         const assignDelievry = await AssignedDelivery.findOne({
            deliveries: delivery._id,
         }).populate("deliveries");

            if(assignDelievry){
                const allCompleted = assignDelievry.deliveries.every(
                    (d) => d.status === "completed"
                );
                if(allCompleted){
                    assignDelievry.status = "completed";
                    assignDelievry.endTime = new Date();
                    await assignDelievry.save();

                    driver.currentLocation = null;
                    driver.availability = true;
                    await driver.save();
                }
            }

            await Order.findOneAndUpdate(
                { orderNumber: delivery.orderID },
                { status: "Completed" }
            );

            await Order.save();

         res.status(200).json({message: "Delivery marked as completed", delivery});
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: error.message});
    }
};


export const updateDriverProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;

    const driver = await Driver.findOneAndUpdate(
      { driverID: id },
      { name, email, phone },
      { new: true }
    );

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    const employee = await Employee.findByIdAndUpdate(
      id,
      { name, email, phone },
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      driver,
      employee,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating profile", error: err.message });
  }
};