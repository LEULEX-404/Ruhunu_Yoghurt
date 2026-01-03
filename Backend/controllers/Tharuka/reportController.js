import Employee from "../../models/Tharuka/Employee.js";
import Driver from "../../models/Tharuka/Driver.js"
import Attendance from "../../models/Tharuka/Attendence.js";

export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({});
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find({}, "employeeID name points");
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAttendanceByRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const attendance = await Attendance.find({
      date: { $gte: new Date(startDate), $lte: new Date(endDate) }
    });
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
