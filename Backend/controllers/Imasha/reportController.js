import AssignDelivery from "../../models/Imasha/AssignDelivery.js";
import Delivery from "../../models/Imasha/Delivery.js";

export const dailyCompleted = async (req, res) => {
  try {
    
    const { start, end } = req.query;

    let startDate, endDate;

    if (start && end) {
     
      startDate = new Date(start);
      endDate = new Date(end);
      endDate.setHours(23, 59, 59, 999);
    } else if (start) {
     
      startDate = new Date(start);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(start);
      endDate.setHours(23, 59, 59, 999);
    } else {
      
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 1);
    }

    const completed = await AssignDelivery.aggregate([
      {
        $match: {
          status: "completed",
          endTime: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $lookup: {
          from: "drivers",
          localField: "driver",
          foreignField: "driverID",
          as: "driverInfo",
        },
      },
      { $unwind: { path: "$driverInfo", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "deliveries",
          localField: "deliveries",
          foreignField: "_id",
          as: "deliveryDetails",
        },
      },
      {
        $project: {
          _id: 1,
          employeeID: 1,
          totalWeight: 1,
          status: 1,
          startTime: 1,
          endTime: 1,
          driverName: "$driverInfo.name",
          driverEmail: "$driverInfo.email",
          driverPhone: "$driverInfo.phone",
          deliveries: "$deliveryDetails",
        },
      },
    ]);

    res.json(completed);
  } catch (err) {
    console.error("Error fetching completed reports:", err);
    res.status(500).json({ message: err.message });
  }
};



export const pendingDeliveries = async (req, res) => {
  try {
    const pending = await AssignDelivery.aggregate([
      {
        $match: {
          status: { $in: ["assigned", "sceduled"] },
        },
      },
      {
        $lookup: {
          from: "drivers",
          localField: "driver",
          foreignField: "driverID",
          as: "driverInfo",
        },
      },
      { $unwind: { path: "$driverInfo", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "deliveries",
          localField: "deliveries",
          foreignField: "_id",
          as: "deliveryDetails",
        },
      },
      {
        $project: {
          _id: 1,
          status: 1,
          startTime: 1,
          endTime: 1,
          employeeID: 1,
          totalWeight: 1,
          driverName: "$driverInfo.name",
          driverEmail: "$driverInfo.email",
          driverPhone: "$driverInfo.phone",
          driverEmployeeID: "$driverInfo.employeeID",
          deliveries: "$deliveryDetails",
        },
      },
    ]);

    res.json(pending);
  } catch (err) {
    console.error("Error fetching pending deliveries:", err);
    res.status(500).json({ message: err.message });
  }
};




export const driverPerformance = async (req, res) => {
  try {
    const { start, end } = req.query;

    let startDate, endDate;

    if (start && end) {
      // Both start and end dates provided
      startDate = new Date(start);
      endDate = new Date(end);
      endDate.setHours(23, 59, 59, 999);
    } else if (start) {
      // Only start date provided (single day)
      startDate = new Date(start);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(start);
      endDate.setHours(23, 59, 59, 999);
    } else {
      // Default: today's range
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 1);
    }

    const data = await AssignDelivery.aggregate([
      {
        $match: {
          status: "completed",
          endTime: { $gte: startDate, $lte: endDate }, // 🔹 date filter like dailyCompleted
        },
      },
      { $unwind: "$deliveries" },
      {
        $lookup: {
          from: "drivers",
          localField: "driver",
          foreignField: "driverID",
          as: "driverInfo",
        },
      },
      { $unwind: { path: "$driverInfo", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: "$driver",
          employeeID: { $first: "$driverInfo.employeeID" },
          driverName: { $first: "$driverInfo.name" },
          totalDeliveries: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          driverID: "$_id",
          driverName: 1,
          employeeID: 1,
          totalDeliveries: 1,
        },
      },
    ]);

    res.json(data);
  } catch (err) {
    console.error("Error fetching driver performance:", err);
    res.status(500).json({ message: err.message });
  }
};





export const revenueSummary = async (req, res) => {
  try {
    const data = await Delivery.aggregate([
      {
     
        $match: { status: "completed" }
      },
      {
       
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" }
          },
          totalRevenue: { $sum: "$cost" },
          totalDeliveries: { $sum: 1 }
        }
      },
      {
      
        $project: {
          _id: 0,
          date: "$_id",
          totalRevenue: 1,
          totalDeliveries: 1
        }
      },
      {
    
        $sort: { date: -1 }
      }
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


