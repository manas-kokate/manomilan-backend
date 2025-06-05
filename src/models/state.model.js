import mongoose from 'mongoose'

const StateSchema = new mongoose.Schema({
    state: {
        type: String,
        required: true
    }
})

export default mongoose.model('state', StateSchema);