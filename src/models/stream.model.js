import mongoose from "mongoose"

const StreamSchema = new mongoose.Schema({
    stream: {
        type: String,
        required: true
    }
})

export default mongoose.model('stream', StreamSchema)