import mongoose from 'mongoose'

const userPackageTrackSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    franchisePackage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'franchisePackage'
    },
    freePackage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'freePackage'
    },
}, { timestamps: true })

export default mongoose.model('userPackageTrack', userPackageTrackSchema)