import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({

    employeeID: {
        type: String,
        required: true,
        unique: true
    },

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    }, 

    position: {
    type: String,
    enum: ["Unassigned", "Manager", "Driver", "Staff"],
    default: "Unassigned"
    },

    phone: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

}, { timestamps: true });

export default mongoose.models.Employee ||mongoose.model("Employee", employeeSchema);