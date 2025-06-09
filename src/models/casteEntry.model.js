import mongoose from "mongoose";

const casteEntrySchema = new mongoose.Schema({
    subCaste: {
        type: String,
        required: true
    },
    caste: {
        type: String,
        required: true
    },
    religion: {
        type: String,
        required: true
    }
})

export default mongoose.model('subcaste', casteEntrySchema)