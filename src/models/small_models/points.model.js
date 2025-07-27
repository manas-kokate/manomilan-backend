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
    },
    addDate: {
        type: Date,
        required: true
    }
}, { timestamps: true });

export default mongoose.model('adminPoints', pointsSchema)