import mongoose from 'mongoose';

const assignDeliverySchema = new mongoose.Schema({

    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Driver",
        required: true,
    },
    employeeID:{
        type:String,
        ref:"Driver",
        required:true,
    },
    deliveries:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Delivery",
    }],
    totalWeight:{
        type:Number,
        required:true,
    },
    assignDate:{
        type:Date,
        default:Date.now,
    },
    status:{
        type: String,
        enum: ["assigned", "sceduled", "completed"],
        default: "assigned"
    },
    startTime: {
        type:Date,
        default: null
    },
    endTime: {
        type: Date,
        default: null
    }
});

export default mongoose.model("AssignDelivery", assignDeliverySchema)