import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
  MID: { type: String, required: true },
  name: { type: String, required: true },
  action: { type: String, enum: ["Add", "Remove"], required: true },
  quantity: { type: Number, required: true },
  time: { type: Date, default: Date.now }
});

export default mongoose.model("RawMaterialHistory", historySchema);
