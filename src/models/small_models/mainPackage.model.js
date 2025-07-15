import mongoose from "mongoose";

const mainPackageSchema = new mongoose.Schema({
    numberOfAddresses: { type: Number, required: true },
    memberCost: { type: Number, required: true },
    adminShare: { type: Number, required: true },
    validity: { type: Number, required: true },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Inactive' },
    packageName: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('MainPackage', mainPackageSchema);
