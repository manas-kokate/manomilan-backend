import mongoose from "mongoose"

const degreeSchema = new mongoose.Schema({
    degree: { type: String },
    stream: { type: String }
})

export default mongoose.model('Degree', degreeSchema)