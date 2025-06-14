import mongoose from 'mongoose'

const StateSchema = new mongoose.Schema({
    state: {
        type: String,
        required: true
    },
    country: {
        type: mongoose.Types.ObjectId,
        ref: 'country'
    }
})

export default mongoose.model('state_Country', StateSchema);