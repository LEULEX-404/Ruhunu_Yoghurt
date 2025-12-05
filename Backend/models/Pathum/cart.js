import mongoose from "mongoose";

const cartSchema = mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId,
        ref: "products", required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      subtotal: { type: Number, required: true },
    },
  ],
  totalWeight: {
    type: Number,
    default: 0 },
  totalCost: {
    type: Number,
    default: 0 },
  promocode: {
    type: String },
});

const Cart = mongoose.model("carts", cartSchema)
export default Cart
