import mongoose from "mongoose";

const SupplierSchema = new mongoose.Schema({
    SID: {
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
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
    },
    materials: [{
        type: String,
        required: true
    }],
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String, 
        required: true,
        match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"]
    },
    schedule:{
        type:Date,

    },
    rating: {
        type: Number,
        default: 0
    },
    numRatings: {
        type: Number,
        default: 0
    },
    Status:{
        type:String,
    }
    

},{ timestamps: true });

export default mongoose.model("Supplier", SupplierSchema);
