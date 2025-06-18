import mongoose from "mongoose"

const degreeSchema = new mongoose.Schema({
    degree: {
        type: String,
        required: true
    }
})