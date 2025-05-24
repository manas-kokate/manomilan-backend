import { Schema, model } from "mongoose";
import mongoose from "mongoose";

const expectationSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    martialStatus: {
        type: String,
        enum: ['unmarried', 'divorced', 'widowed', 'being divorced'],
        required: true
    },
    currentResidence: {
        type: String,
        required: true
    },
    height: {
        type: String,
        required: true
    },
    education: {
        type: [String],
        required: true
    },
    occupation: {
        type: [String],
        required: true,
        enum: ['Government Service', 'Private Sector', 'Service+bussiness', 'Student', 'Internship'],
    },
    monthlyIncome: {
        min: {
            type: String,
            required: true
        },
        max: {
            type: String,
            required: true
        }
    },
    nationality: {
        type: String,
        required: true,
        default: 'Indian'
    },
    religion: {
        type: String,
        required: true,
    }
});

export default model('expectation', expectationSchema)