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
    enum: ["Unassigned", "HR Manager", "Delivery Manager", "Product Manager", "Stock Manager", "Order Manager", "Driver", "Staff"],
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