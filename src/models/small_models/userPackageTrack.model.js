import mongoose from 'mongoose'

const userPackageTrackSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    freeAddresses: {

    }
})

export default mongoose.model('userPackageTrack', userPackageTrackSchema)