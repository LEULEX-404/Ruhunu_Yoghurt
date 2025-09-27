import mongoose from "mongoose";

// Create a new schema called promocodeSchema
const promocodeSchema = new mongoose.Schema({

    code : { type : String, required : true},
    discountType: { type: String, enum: ["percentage", "fixed"], required: true },
    discountValue : { type : Number, required :true},
    expiryDate : { type : Date, required : true},
    usageLimit: { type: Number, default: 1 },
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }}, 
    // Add "timestamps" option
   { timestamps: true });

// Create a model named "Promocode" from the schema   
export default mongoose.model("Promocode",promocodeSchema);
