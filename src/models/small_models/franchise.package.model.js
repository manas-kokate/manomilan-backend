import mongoose from 'mongoose'

const franchisePackageSchema = new mongoose.Schema({
    mainPackageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MainPackage'
    },
    vipPackage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'vippackage'
    },
    addOnPackage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'addonpackage'
    },
    franchiseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'franchise'
    },
    franchiseShare: {
        type: Number,
        required: true
    },
    distributorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'distributor'
    },
    distributorShare: {
        type: Number,
        required: true
    }
}, { timestamps: true })

export default mongoose.model('franchisePackage', franchisePackageSchema)