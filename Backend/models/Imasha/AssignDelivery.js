import mongoose from 'mongoose';

const assignDeliverySchema = new mongoose.Schema({

    driver:{
        type:mongoose.Schema.Type.ObjectId,
        ref:"Driver",
        required:true,
    },
    deliveries:[{
        type:mongoose.Schema.Type.ObjectId,
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