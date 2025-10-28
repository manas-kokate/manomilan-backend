import mongoose from "mongoose";

const freePackageSchema = new mongoose.Schema({
    NumOfFreeAddress: {
        type: Number,
        required: true
    },
    packageId: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive']
    },
    validity: {
        type: Number
    }
}, { timestamps: true });

export default mongoose.model('freePackage', freePackageSchema)