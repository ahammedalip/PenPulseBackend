import mongoose from 'mongoose';
import Category from './articleCategory.js'; 

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
        minlength: 10,
        maxlength: 15,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    dob: {
        type: Date,
        required: true,
    },
    preferences: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', // Ensure 'Category' is the model name
    }],
    isVerified: {
        type: Boolean,
        default: false,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    otp: {
        type: Number,
        // Optional: remove `required` if OTP is not always required
    },         
});

const User = mongoose.model('User', userSchema);

export default User;
