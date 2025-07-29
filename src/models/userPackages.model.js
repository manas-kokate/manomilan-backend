import mongoose from 'mongoose'

const userPackagesSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    franchisePackageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'franchisePackage'
    }
}, { timestamps: true })

export default mongoose.model('userPackages', userPackagesSchema)