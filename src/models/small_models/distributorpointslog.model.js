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
    By: {
        type: String,
        required: true
    }
}, { timestamps: true });

export default mongoose.model('distributorLog', distributorLog)