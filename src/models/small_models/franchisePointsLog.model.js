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
    allotmentDate: {
        type: Date,
        required: true
    },
    By: {
        type: String,
        required: true
    }
}, { timestamps: true });

export default mongoose.model('franchiseLog', franchiseLog)