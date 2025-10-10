// GET /api/reports/completed-daily
import AssignDelivery from "../../models/Imasha/AssignDelivery.js";
import Delivery from "../../models/Imasha/Delivery.js";
import Driver from "../../models/Tharuka/Driver.js";

export const dailyCompleted = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0,0,0,0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate()+1);

    const completed = await AssignDelivery.find({
      status: "completed",
      endTime: { $gte: today, $lt: tomorrow }
    }).populate("driver deliveries");

    res.json(completed);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
};


// GET /api/reports/pending
export const pendingDeliveries = async (req, res) => {
  try {
    const pending = await AssignDelivery.find({
      status: { $in: ["assigned", "sceduled"] }
    }).populate("driver deliveries");
    res.json(pending);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
};


// GET /api/reports/driver-performance
export const driverPerformance = async (req, res) => {
  try {
    const data = await AssignDelivery.aggregate([
      { $match: { status: "completed" } },
      { $unwind: "$deliveries" },
      {  $group: { 
          _id: "$driver",
          employeeID: { $first: "$employeeID" },
          totalDeliveries: { $sum: 1 } 
        } },
    ]);
    res.json(data);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/reports/revenue-summary

export const revenueSummary = async (req, res) => {
  try {
    const data = await Delivery.aggregate([
      { $group: {
          _id: null,
          totalRevenue: { $sum: "$cost" },
          totalDeliveries: { $sum: 1 }
      }}
    ]);
    res.json([data[0]]); // wrap in array
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
};
