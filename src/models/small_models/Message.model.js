import mongoose from "mongoose";

const messagesSchema = new mongoose.Schema({
    senderId: {
        type: String,
        required: true
    },
    receiverId: {
        type: [String],
        required: true
    },
    from: {
        type: String,
        required: true
    },
    to: {
        type: [String],
        required: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['sent', 'drafted'],
    }

}, { timestamps: true })

export default mongoose.models.message || mongoose.model('message', messagesSchema);
