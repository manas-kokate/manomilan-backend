import mongoose from "mongoose";

const distributorLog = new mongoose.Schema({
    distributorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'distributor'
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

export default mongoose.model('distributorLog', distributorLog)