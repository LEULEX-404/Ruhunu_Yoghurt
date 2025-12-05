import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    productId : {
        type : String,
        required : true,
        unique : true
    },
    name : {
        type : String,
        required : true
    },
    altNames : [{
        type : String
    }],
    description : {
        type : String,
    },
    images : [{
        type : String
    }],
    labelledPrice : {
        type : Number,
        required : true
    },
    price : {
        type : Number,
    },
    expDate : {
        type : Date,
        required : true
    },
    weight : {
        type : Number,
        required : true
    },
    unit : {
        type : String,
        enum : ['kg', 'g', 'l', 'ml'],
        required : true
    },
    rating : {
        type : Number,
        default : 0
    },
    numRatings : {
        type : Number,
        default : 0
    },
    quantity : {
        type : Number,
        required : true,
        default : 0
    },
    isAvailable : {
        type : Boolean,
        required : true,
        default : true
    }
});

// auto update is available before saving
productSchema.pre("save", function(next) {
    this.isAvailable = this.quantity > 0;
    next();
})

//handle direct updates like findOneAndUpdate
productSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();

  if (update.quantity !== undefined || (update.$inc && update.$inc.quantity !== undefined)) {
    let newQuantity = update.quantity;

    // If using $inc, we need to calculate new quantity from database
    if (update.$inc && update.$inc.quantity !== undefined) {
      this.model.findOne(this.getQuery()).then((doc) => {
        if (doc) {
          const finalQuantity = doc.quantity + update.$inc.quantity;
          this.set({ isAvailable: finalQuantity > 0 });
        }
        next();
      });
      return; // prevent calling next twice
    }

    // Direct quantity update
    this.set({ isAvailable: newQuantity > 0 });
  }
  next();
});


const Product = mongoose.model("products", productSchema)

export default Product;