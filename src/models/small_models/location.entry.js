import mongoose from 'mongoose'

const LocationSchema = new mongoose.Schema({
    city: {
        type: String,
        required: true
    },
    stateCountry: {
        state: { type: String },
        country: { type: String }
    }
})

export default mongoose.model('location', LocationSchema);