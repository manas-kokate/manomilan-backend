import mongoose from 'mongoose'

const LocationSchema = new mongoose.Schema({
    city: {
        type: String,
        required: true
    },
    stateCountry: {
        type: mongoose.Types.ObjectId,
        ref: 'state_Country'
    }
})

export default mongoose.model('location', LocationSchema);