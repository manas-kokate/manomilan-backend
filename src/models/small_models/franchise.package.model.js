import mongoose from 'mongoose'

const franchisePackageSchema = new mongoose.Schema({
    mainPackageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MainPackage'
    },
    vipPackage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'VipPackage'
    },
    addOnPackage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AddOnPackage'
    },
    franchiseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'franchise'
    },
    franchiseShare: {
        type: Number,
    },
    distributorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'distributor'
    },
    distributorShare: {
        type: Number,
    }
}, { timestamps: true })

export default mongoose.model('franchisePackage', franchisePackageSchema)