import mongoose from "mongoose"

const sectSchema = new mongoose.Schema({
    sect: {
        type: String
    }
})

export default mongoose.model('sect', sectSchema)