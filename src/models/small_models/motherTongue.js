import mongoose from "mongoose";

const motherTongueSchema = new mongoose.Schema({
    motherTongue: {
        type: String
    }
})

export default mongoose.model('motherTongue', motherTongueSchema)