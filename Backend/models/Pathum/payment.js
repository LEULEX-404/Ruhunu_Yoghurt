import mongoose from "mongoose";

const paymentSchema = mongoose.Schema({
    paymentId : {
        type : String,
        required : true,
        unique : true
    },
    name : {
        type : String,
        required : true,
    },
    products : [{
        productInfo : {
            productId : {
                type : String,
                required : true
            },
            name : {
                type : String,
                required : true
            },
            labelledPrice : {
                type : Number,
                required : true
            },
            price : {
                type : Number,
                required : true
            }
        },
        quantity : {
            type : Number,
            required : true
        }
    }],
    email : {
        type : String,
        required : true,
    },
    address : {
        type : String,
        required : true
    },
    phone : {
        type : String,
        required : true
    },
    total : {
        type : Number,
        required : true
    },
    paymentMode : {
        type : String,
        required : true
    },
    cardNumber : {
        type : String,
    },
    cardcvv : {
        type : String
    },
    date : {
        type : Date,
        default : Date.now
    },
    coupon : {
        type : String
    }

})

const Payment = mongoose.model("payments", paymentSchema)

export default Payment