// GET /api/reports/completed-daily
import AssignDelivery from "../../models/Imasha/AssignDelivery.js";
import Delivery from "../../models/Imasha/Delivery.js";
import Driver from "../../models/Tharuka/Driver.js";

export const dailyCompleted = async (req, res) => {
  try {
    // 🔹 Extract optional query parameters
    const { start, end } = req.query;

    let startDate, endDate;

    if (start && end) {
      // 🔹 If both dates provided (View by Range)
      startDate = new Date(start);
      endDate = new Date(end);
      endDate.setHours(23, 59, 59, 999);
    } else if (start) {
      // 🔹 If only one date provided, use that day
      startDate = new Date(start);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(start);
      endDate.setHours(23, 59, 59, 999);
    } else {
      // 🔹 Default: today’s report
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 1);
    }

    // 🔹 Filter deliveries completed between startDate and endDate
    const completed = await AssignDelivery.find({
      status: "completed",
      endTime: { $gte: startDate, $lte: endDate },
    }).populate("driver deliveries");

    res.json(completed);
  } catch (err) {
    console.error("Error fetching completed reports:", err);
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
      {
        // Filter only completed deliveries
        $match: { status: "completed" }
      },
      {
        // Group by date based on updatedAt field
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" }
          },
          totalRevenue: { $sum: "$cost" },
          totalDeliveries: { $sum: 1 }
        }
      },
      {
        // Rename _id to date
        $project: {
          _id: 0,
          date: "$_id",
          totalRevenue: 1,
          totalDeliveries: 1
        }
      },
      {
        // Sort by most recent date first
        $sort: { date: -1 }
      }
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


