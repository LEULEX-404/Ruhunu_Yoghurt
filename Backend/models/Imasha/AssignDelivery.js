import mongoose from 'mongoose';

const assignDeliverySchema = new mongoose.Schema({

    driver:{
        type:mongoose.Schema.type.objectId,
        ref:"Driver",
        required:true,
    },
    deliveries:[{
        type:mongoose.Schema.type.objectId,
        ref:"Delivery",
    }],
    totalWeight:{
        type:Number,
        required:true,
    },
    assignData:{
        type:Date,
        default:Date.now,
    },
});

export default mongoose.model("AssignDelivery", assignDeliverySchema)