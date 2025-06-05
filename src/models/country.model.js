import mongoose from 'mongoose'

const CitySchema = new mongoose.Schema({
    country: {
        type: String,
        required: true
    }
})

export default mongoose.model('countrie', CitySchema);