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

const Product = mongoose.model("products", productSchema)

export default Product;