import mongoose from "mongoose";

const driverSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true 
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    vehicleCapacity: {
        type: Number,
    },
    currentLocation: {
        type: String,
        default: null
    },

    availability: {
        type: Boolean,
        default: true
    },
    points: {
        type: Number,
        default: 0
    },
}

, { timestamps: true });

export default mongoose.model("Driver", driverSchema);