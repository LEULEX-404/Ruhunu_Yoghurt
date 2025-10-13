import mongoose from "mongoose";

const rawMaterialRequestSchema = new mongoose.Schema({
  requestId: { type: String, required: true, unique: true },
  
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true },
  
  materialId: { type: mongoose.Schema.Types.ObjectId, ref: "Rawmaterial", required: true },
  
  quantity: { type: Number, required: true },
  
  unit: { type: String, required: true },
  
  status: { type: String, enum: ["Pending", "Approved", "Rejected", "Delivered"], default: "Pending" },
  
  requestedAt: { type: Date, default: Date.now },
  
  approvedAt: { type: Date },
  
  rejectedAt: { type: Date },
  
  deliveredAt: { type: Date },
}, { timestamps: true });

export default mongoose.model("RawMaterialRequest", rawMaterialRequestSchema);
