import Driver from "../../models/Tharuka/Driver.js";
import Delivery from "../../models/Imasha/Delivery.js";
import AssignedDelivery from "../../models/Imasha/AssignDelivery.js";

export const assignDelivery = async (req, res)=>{
    try{
        const { driverId, deliveryIds} = req.body;

        const driver = await Driver.findOne({driverID: driverId});
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

        let assigned = await AssignedDelivery.findOne({driver:driverId,status: { $ne: "completed" }})
        if(!assigned){
            if(newDeliveriesWeight > driver.vehicleCapacity){
                return res.status(400).json({message: "Cannot assigned: Exceeds vehicle capacity"});
            }

            assigned = new AssignedDelivery({
                driver: driverId,
                employeeID: driver.employeeID,
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

            const allAssignedDeliveries = await Delivery.find({
                assignedDriver: driverId,
                status:"assigned" 
            })

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

        const DriversWithLoad = await Promise.all(
            Drivers.map(async (driver) =>{
                const assigned = await AssignedDelivery.find({
                    driver: driver.driverID,
                    status: { $in: ["assigned", "sceduled"] }
                });

                console.log("Assigned Deliveries:", assigned);
                console.log("driverID:", driver.driverID);

                const totalWeight = assigned.reduce(
                    (sum,ad) => sum + (ad.totalWeight || 0),
                    0
                );

                const remainingCapacity = driver.vehicleCapacity - totalWeight;

                const driveAvalability = await Driver.findOne({driverID: driver.driverID})

                    if(driveAvalability && remainingCapacity <= 0){
                    driveAvalability.availability = false;
                }

                await driveAvalability.save();

                return{
                    ...driver.toObject(),
                    assignedWeight: totalWeight,
                    remainingCapacity
                };
            })
            
        );

        res.json({
            Deliveries,
            Drivers:DriversWithLoad
        });
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
}

export const scheduleAssignedDelivery = async (req, res) =>{
    try{
        const{assignedDeliveryId, startTime, endTime } = req.body;

        const assigned = await AssignedDelivery.findById(assignedDeliveryId);

        if(!assigned){
            return res.status(404).json({message: "Assigned delivery not found"});
        }

        assigned.status = "sceduled";
        assigned.startTime = new Date(startTime);
        assigned.endTime = new Date(endTime);

        await assigned.save();

        const driver = await Driver.findOne({driverID: assigned.driver});
               driver.availability = false;

            await driver.save();


        res.status(200).json({message: "Delivery sceduled successfully", assigned});
    }
    catch(error)
    {
        console.error(error);
        res.status(500).json({message: error.message});
    }
};

export const getStats = async (req, res) => {
  try {
    const totalDeliveries = await Delivery.countDocuments({ status: "pending" });
    const pending = await AssignedDelivery.countDocuments({ status: "sceduled" });

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const completedToday = await AssignedDelivery.countDocuments({
      status: "completed",
      endTime: { $gte: startOfDay, $lte: endOfDay }
    });

    const pendingToday = await AssignedDelivery.countDocuments({
      status: { $ne: "completed" }, 
      endTime: { $gte: startOfDay, $lte: endOfDay }
    });

    const drivers = await Driver.countDocuments({ availability: true });

    res.json({
      totalDeliveries,
      pending,
      completedToday,
      pendingToday,
      drivers
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
//New to final

export const autoAssignDelivery = async (req, res) => {
  try {
    const { deliveryId } = req.body;

    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) return res.status(404).json({ message: "Delivery not found." });
    if (delivery.status !== "pending") {
      return res.status(400).json({ message: "This delivery is already assigned." });
    }

    const drivers = await Driver.find({ availability: true });
    if (drivers.length === 0)
      return res.status(400).json({ message: "No available drivers." });

    let bestDriver = null;
    let minDistanceDiff = Infinity;

    for (let driver of drivers) {

      const assigned = await AssignedDelivery.findOne({
        driver: driver.driverID,
        status: { $in: ["assigned", "scheduled"] },
      }).populate("deliveries");

      const totalWeight = assigned ? assigned.totalWeight : 0;

      if (totalWeight + delivery.productWeight > driver.vehicleCapacity) continue;

      let distanceDiff;
      if (assigned && assigned.deliveries.length > 0) {
        const diffs = assigned.deliveries.map((d) =>
          Math.abs(d.distanceKm - delivery.distanceKm)
        );
        distanceDiff = Math.min(...diffs);
      } else {
        distanceDiff = Math.abs(delivery.distanceKm - (driver.currentLocationDistance || 0));
      }

      if (distanceDiff < minDistanceDiff) {
        minDistanceDiff = distanceDiff;
        bestDriver = driver;
      }
    }

    if (!bestDriver)
      return res.status(400).json({ message: "No suitable driver found for this delivery." });

    let assignedRecord = await AssignedDelivery.findOne({
      driver: bestDriver.driverID,
      status: { $in: ["assigned", "scheduled"] },
    });

    if (!assignedRecord) {

      assignedRecord = new AssignedDelivery({
        driver: bestDriver.driverID,
        employeeID: bestDriver.employeeID,
        deliveries: [delivery._id],
        totalWeight: delivery.productWeight,
        status: "assigned",
      });
    } else {

      assignedRecord.deliveries.push(delivery._id);
      assignedRecord.totalWeight += delivery.productWeight;
    }

    await assignedRecord.save();

    delivery.assignedDriver = bestDriver.driverID;
    delivery.status = "assigned";
    await delivery.save();

    const updatedTotalWeight = assignedRecord.totalWeight;
    if (updatedTotalWeight >= bestDriver.vehicleCapacity) {
      bestDriver.availability = false;
    }

    const allAssignedDeliveries = await Delivery.find({
      assignedDriver: bestDriver.driverID,
      status: "assigned",
    });

    if (allAssignedDeliveries.length > 0) {
      const current = allAssignedDeliveries.reduce(
        (max, d) => (d.distanceKm > max.distanceKm ? d : max),
        allAssignedDeliveries[0]
      );
      bestDriver.currentLocation = current.address;
    }

    await bestDriver.save();

    res.json({
      message: `Delivery assigned to ${bestDriver.name} successfully.`,
      driver: bestDriver,
      assignedDelivery: assignedRecord,
      currentLocation: bestDriver.currentLocation,
    });
  } catch (err) {
    console.error("Auto assign error:", err);
    res.status(500).json({ error: err.message });
  }
};



//new

export const autoScheduleDelivery = async (req, res) => {
  try {
    const { assignedDeliveryId } = req.body;

    const assigned = await AssignedDelivery.findById(assignedDeliveryId);
    if (!assigned) {
      return res.status(404).json({ message: "Assigned delivery not found." });
    }

    const now = new Date();

    // Start and end for today
    let startTime = new Date();
    startTime.setHours(8, 0, 0, 0); // 8:00 AM
    let endTime = new Date(startTime.getTime() + 4 * 60 * 60 * 1000); // +4 hours
    if (endTime.getHours() > 17) endTime.setHours(17, 0, 0, 0); // cap at 5 PM

    const minStartTime = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now

    // Check if start time is within 8AM–12PM and at least 1 hour from now
    const startHour = startTime.getHours();
    const startMinutes = startTime.getMinutes();

    if (
      startTime < now ||
      startTime < minStartTime ||
      startHour < 8 ||
      (startHour === 12 && startMinutes > 0) ||
      startHour > 12
    ) {
      // Cannot schedule today, suggest next day
      return res.status(400).json({
        message: "Cannot schedule today due to time constraints.",
        suggestNextDay: true,
      });
    }

    // Assign times
    assigned.status = "sceduled";
    assigned.startTime = startTime;
    assigned.endTime = endTime;
    await assigned.save();

    // Update driver availability
    const driver = await Driver.findOne({ driverID: assigned.driver });
    if (driver) {
      driver.availability = false;
      await driver.save();
    }

    res.status(200).json({
      message: "Delivery scheduled successfully.",
      assigned,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};



export const scheduleNextDay = async (req, res) => {
  try {
    const { assignedDeliveryId } = req.body;

    const assigned = await AssignedDelivery.findById(assignedDeliveryId);
    if (!assigned) {
      return res.status(404).json({ message: "Assigned delivery not found." });
    }

    // Next day date
    const nextDay = new Date();
    nextDay.setDate(nextDay.getDate() + 1);

    // Auto-start: 8 AM next day
    let startTime = new Date(nextDay);
    startTime.setHours(8, 0, 0, 0);

    // Auto-end: 4 hours after start, max 5 PM
    let endTime = new Date(startTime.getTime() + 4 * 60 * 60 * 1000);
    if (endTime.getHours() > 17) {
      endTime.setHours(17, 0, 0, 0); // cap at 5 PM
    }

    assigned.status = "sceduled";
    assigned.startTime = startTime;
    assigned.endTime = endTime;
    await assigned.save();

    const driver = await Driver.findOne({ driverID: assigned.driver });
    if (driver) {
      driver.availability = false;
      await driver.save();
    }

    res.status(200).json({ message: "Delivery scheduled for next day successfully.", assigned });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
