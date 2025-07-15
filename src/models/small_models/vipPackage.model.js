import mongoose from "mongoose";

const vipPackageSchema = new mongoose.Schema({
    packageId: { type: Number },
    packageName: { type: String, required: true },
    numberOfAddresses: { type: Number, required: true },
    memberCost: { type: Number, required: true },
    adminShare: { type: Number, required: true },
    validity: { type: Number, required: true },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Inactive' },
}, { timestamps: true });

export default mongoose.model('VipPackage', vipPackageSchema);
