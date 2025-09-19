import Attendence from "../../models/Tharuka/attendence.js";

export const getTodaysAttendence = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const record = await Attendence.findOne({
            employeeID: req.user.employeeID,
            date: today
        });

        res.json({ checkedIn: !!record });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching attendance', error: error.message });
    }
};


export const checkIn = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const existing = await Attendence.findOne({
            employeeID: req.user.employeeID,
            date: today
        });

        if(existing) return res.status(400).json({ message: 'Already checked in today' });

        const newAttendence = new attendence({
            employeeID: req.user.employeeID,
            checkInTime: new Date()
        });

        await newAttendence.save();
        res.json({ message: 'Checked in successfully', attendence: newAttendence });
    }
    catch (error) {
        res.status(500).json({ message: 'Error during check-in', error: error.message });
    }
}

export const earlyLeave = async (req, res) => {
    try {
        const { reason } = req.body;
        if (!reason) return res.status(400).json({ message: 'Reason is required for early leave' });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const attendence = await Attendence.findOne({
            employeeID: req.user.employeeID,
            date: today
        });

        if (!attendence) return res.status(400).json({ message: 'You must check in first' });

        attendence.earlyLeave = {
            reason,
            submittedAt: new Date()
        };
        await attendence.save();
        res.json({ message: 'Early leave recorded', attendence });
    }
    catch (error) {
        res.status(500).json({ message: 'Error during early leave', error: error.message });
    }
    
};