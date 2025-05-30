import { Schema, model } from "mongoose";

const expectationSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    matchAgeFrom: { type: String },
    matchAgeTo: { type: String },
    matchHeightFrom: { type: String },
    matchHeightTo: { type: String },
    prefEdu: { type: String },
    matchOccu: { type: String },
    matchMaritalSts: { type: String },
    matchIncome: { type: String },
    matchCaste: { type: String },
    matchWorkLocCitDis: { type: String },
    sect: {
        type: String,
        enum: ['mahanubhav', 'kabir panthi', 'warkari', 'malkari']
    },
    manglik: {
        type: String,
        enum: ['manglik', 'non-manglik', 'partial manglik(soumya mangal)']
    },
    gotra: { type: String },
    foodChoices: {
        type: String,
        enum: ['vegetarian', 'non-vegetarian', 'mixed']
    },
    spects: {
        type: String,
        enum: ['Yes', 'No']
    }
}, { timestamps: true });

export default model('expectation', expectationSchema)