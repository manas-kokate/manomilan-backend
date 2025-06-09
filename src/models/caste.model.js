import mongoose from "mongoose";

const casteSchema = new mongoose.Schema({
    caste: {
        type: String,
        required: true
    }
})

export default mongoose.model('Caste', casteSchema)