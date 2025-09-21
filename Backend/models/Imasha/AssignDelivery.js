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
});

export default mongoose.model("AssignDelivery", assignDeliverySchema)