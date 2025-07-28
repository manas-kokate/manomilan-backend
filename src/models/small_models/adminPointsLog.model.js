import mongoose from "mongoose";

const adminLog = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin'
    },
    points: {
        type: Number,
        default: 0
    },
    Type: {
        type: String,
        enum: ['Credited', 'Debited']
    },
    Balance: {
        type: Number
    }
}, { timestamps: true });

export default mongoose.model('adminLog', adminLog)