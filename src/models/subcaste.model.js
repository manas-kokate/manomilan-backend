import mongoose from "mongoose";

const subCasteEntrySchema = new mongoose.Schema({
    subCaste: {
        type: String,
        required: true
    },
    casteReligion: {
        caste: {
            type: String,
            required: true
        },
        religion: {
            type: String,
            required: true
        }
    }
})

export default mongoose.model('subcaste', subCasteEntrySchema)