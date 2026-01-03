import mongoose from "mongoose";

const damageSchema = mongoose.Schema({
    productId : {
        type : String,
        required : true,
    },
    name : {
        type : String,
        required : true
    },
    reason : {
        type : String,
        required : true
    },
    quantity : {
        type : Number,
        required : true
    },
})

const Damage = mongoose.model("damages", damageSchema)
export default Damage