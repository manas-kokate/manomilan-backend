import mongoose from "mongoose";

const freePackageSchema = new mongoose.Schema({
    NumOfFreeAddress: {
        type: Number,
        required: true
    },
    validity: {
        type: Date,
        required: true
    },
    packageId: {
        type: Number,
        required: true
    },
    status: {
        type: String
    }
}, { timestamps: true });

export default mongoose.model('freePackage', freePackageSchema)