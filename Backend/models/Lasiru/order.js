import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({

    orderNumber: { type: String, required: true },

    customerName: { type: String, required: true },

    phone:{type: String},
     
    items: [
        {
            product: String,
            quantity: Number,
            price: Number
        }
    ],

    total: Number,

    status: {
        type: String,
        enum: ["pending", "approved", "cancelled", "Completed","Ready to Assign"],
        default: "pending"
    },

    address: {
        type: String,
        required: true
    },

    productWeight: Number,

    priority:{
        type: String,
        enum: ["High", "Low"],
        default: "Low"
    }   
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);