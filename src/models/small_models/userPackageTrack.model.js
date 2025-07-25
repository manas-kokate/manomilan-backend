import mongoose from 'mongoose'

const userPackageTrackSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    freeAddresses: {
        type: Number,
    },
    assignedAddresses: {
        type: Number,
        default: 0
    },
    validity: {
        type: Number,
        default: 0
    },
    allotmentDate: {
        type: Date
    },
    vipPackage: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'VipPackage'
    }],
    addOnPackage: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AddOnPackage'
    }],
    mainPackage: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MainPackage'
    }],
    freePackage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'freePackage'
    }
}, { timestamps: true })

export default mongoose.model('userPackageTrack', userPackageTrackSchema)