import mongoose from "mongoose";

const addOnPackageSchema = new mongoose.Schema({
    packageName: { type: String, required: true },
    numberOfAddresses: { type: Number, required: true },
    memberCost: { type: Number, required: true },
    distributorShare: { type: Number, required: true },
    franchiseShare: { type: Number, required: true },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Inactive' },
    packageId: { type: Number }
}, { timestamps: true });

export default mongoose.model('AddOnPackage', addOnPackageSchema);
