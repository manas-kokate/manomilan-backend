import mongoose from "mongoose";

const pointsSchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin'
    },
    points: {
        type: Number,
        default: 0
    },
    name: {
        type: String
    }
}, { timestamps: true });

export default mongoose.model('adminPoints', pointsSchema)