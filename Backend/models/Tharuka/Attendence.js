import mongoose from 'mongoose';

const attendenceSchema = new mongoose.Schema({
    employeeID: {
        type: String,
        ref: 'Employee',
        required: true
    },
    date: {
        type: Date,
        default: () => new Date(new Date().setHours(0, 0, 0, 0))
    },
    checkInTime: {
        type: Date,
    },
    earlyLeave: {
        reason: String,
        submittedAt: Date,
    }
});

export default mongoose.model('Attendence', attendenceSchema);

