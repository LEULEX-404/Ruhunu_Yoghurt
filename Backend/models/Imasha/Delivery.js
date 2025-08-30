import mongoose from 'mongoose';

const deliverySchema = new mongoose.Schema({
    
    orderID: {
        type:String, 
        required: true},

    customerName:{
        type: String,
        required:true},

    address:{
        type:String, 
        required: true},

    productWeight: {
        type: Number, 
        required: true},

    distanceKm: {
        type: Number, 
        required: true},

    cost: {
        type:Number, 
        default: 0},

    status:{
        type: String,
        enum: ['pending', 'assigned', 'delivered'],
        default: 'pending'
    },

    assignedDriver:{
        type: mongoose.Schema.Types.ObjectId, ref: "User"
    },
    
    },{timestamps: true});

    export default mongoose.model("Delivery", deliverySchema);