import mongoose from "mongoose";

const RawmaterialsSchema = new mongoose.Schema({
    MID: {
        type: String,
        required: true,
        unique: true   
    },
    name: {
        type: String,
        required: true
    },
    unit: {
        type: String,
        enum: ['kg', 'g', 'l', 'ml', 'pcs'], 
        required: true
    },
    quantity: {
        type: Number,   
        required: true,
        min: 0          
    },
    supplier: {
        type: String,
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now  
    },
    isAvailable: {
        type: Boolean,
        default: true       
    }
});


export default mongoose.model("Rawmaterial", RawmaterialsSchema);
