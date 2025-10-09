// models/SupplierDelivery.js
import mongoose from "mongoose";

const supplierDeliverySchema = new mongoose.Schema({
  deliveryId: { type: String, required: true, unique: true },

  // reference by custom IDs instead of ObjectId
  supplierSID: { type: String, ref: "Supplier", required: true },  
  materialMID: { type: String, ref: "Rawmaterial", required: true },  

  quantity: { type: Number, required: true },
  unit: { 
    type: String, 
    enum: ['kg', 'g', 'l', 'ml', 'pcs'], 
    required: true 
  },

  invoiceNo: { type: String },
  vehicleNo: { type: String },
  driverName: { type: String },

  status: {
    type: String,
    enum: ["Pending", "In Transit", "Received", "Rejected"],
    default: "Pending"
  },

  dispatchedAt: { type: Date },
  receivedAt: { type: Date }
}, { timestamps: true });

export default mongoose.model("SupplierDelivery", supplierDeliverySchema);
