import mongoose from "mongoose"

const foodPrefSchema = new mongoose.Schema({
    foodPreference: {
        type: String,
        required: true
    },
})

export default mongoose.model('foodPreference', foodPrefSchema)