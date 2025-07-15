import mongoose from 'mongoose'

const topUpPackageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    numberOfAddresses: { type: Number, required: true },
    cost: { type: Number, required: true },
    distributorShare: { type: Number, required: true },
    franchiseShare: { type: Number, required: true },
    validity: { type: Number, required: true },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Inactive' },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('TopUpPackage', topUpPackageSchema);
