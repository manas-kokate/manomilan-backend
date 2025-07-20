import mongoose from 'mongoose'

const userPackageTrackSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    packagesIds: {
        type: [String],
        required: true,
    }
})

export default mongoose.model('userPackageTrack', userPackageTrackSchema)