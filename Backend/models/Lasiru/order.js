import mongoose from "mongoose";
import Product from "../Pathum/product.js";

const orderSchema = new mongoose.Schema({

    orderNumber: { type: String, required: true },

    customerName: { type: String, required: true },
     
    items: [
        {
            productId : {
                type : String,
                required : true
            },
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

orderSchema.post("findOneAndUpdate", async function (doc) {
  if (doc && doc.status === "cancelled") {
    for (const item of doc.items) {
      // Find product by custom productId
      await Product.findOneAndUpdate(
        { productId: item.productId },
        { $inc: { quantity: item.quantity } }
      );
    }
    console.log(`✅ Products restocked for cancelled order: ${doc.orderNumber}`);
  }
});


export default mongoose.model("Order", orderSchema);