import mongoose from "mongoose";

const messagesSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    franchiseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'franchise'
    },
    distributorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'distributor'
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin'
    },
    isReply: {
        type: Boolean
    },
    franchiseName: {
        type: String,
    },
    distributorName: {
        type: String,
    },
    adminName: {
        type: String,
    },
    message: { type: String, required: true },
    status: { type: String, enum: ['sent', 'draft'], default: 'draft' },
}, { timestamps: true })

export default mongoose.model('message', messagesSchema)