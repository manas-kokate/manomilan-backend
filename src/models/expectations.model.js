import { Schema, model } from "mongoose";

const expectationSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    ageFrom: { type: String },
    ageTo: { type: String },
    heightFrom: { type: String },
    heightTo: { type: String },
    partnerIncome: { type: String },
    abroad: { type: String, default: 'no' },
    issue: { type: String },
    partnerMaritalStatus: { type: String },
    partnerNationality: { type: String },
    partnerOccupation: { type: String },
    partnerEducation: { type: [String] },
    nativePlaceCities: { type: [String] },
    nativePlaceStates: { type: [String] },
    nativePlaceCountries: { type: [String] },
    workingLocationCountries: { type: [String] },
    workingLocationStates: { type: [String] },
    workingLocationCities: { type: [String] },
    religion: { type: [String] },
    subCaste: { type: [String] }
}, { timestamps: true });

export default model('expectation', expectationSchema)