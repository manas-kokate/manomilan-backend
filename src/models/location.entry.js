import mongoose from 'mongoose'

const LocationSchema = new mongoose.Schema({
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    }
})

export default mongoose.model('location', LocationSchema);