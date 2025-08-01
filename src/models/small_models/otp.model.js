import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    otp: {
        type: Number,
        required: true
    }
}, { timestamps: true })

export default mongoose.model('otp', otpSchema)