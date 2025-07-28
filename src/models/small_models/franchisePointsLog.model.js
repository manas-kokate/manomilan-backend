import mongoose from "mongoose";

const franchiseLog = new mongoose.Schema({
    franchiseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'franchise'
    },
    points: {
        type: Number,
        default: 0
    },
    Type: {
        type: String,
        enum: ['Credited', 'Debited']
    },
    By: {
        type: String,
        required: true
    },
    Balance: {
        type: Number
    }
}, { timestamps: true });

export default mongoose.model('franchiseLog', franchiseLog)