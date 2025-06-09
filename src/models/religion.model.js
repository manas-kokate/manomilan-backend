import mongoose from "mongoose";

const religionSchema = new mongoose.Schema({
    religion: {
        type: String,
        required: true
    }
})

export default mongoose.model('religion', religionSchema)