import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    
name: {
    type: String,
    required: true
},
email: {
    type: String,
    required: true,
    unique: true
},
password: {
    type: String,
    required: true
},
address:{
    type: String,
    default: ''
},
phone:{
    type:String,
},
role: {
    type: String,
    default: 'customer',
},
createdAt: {
    type: Date,
    default: Date.now
}

});

export default mongoose.model('User', userSchema);