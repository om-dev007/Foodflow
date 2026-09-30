import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    },
    mobile: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ["user", "owner", "deliveryboy"],
        default: "user"
    },
    otp: {
        type: String
    },
    isOtpVerified: {
        type: Boolean,
        default: false
    },
    otpExpires: {
        type: Date
    }
}, {timestamps: true})

const UserModel = mongoose.model("User", userSchema);

export default UserModel;