import mongoose from "mongoose";

const franchisePackageLogSchema = new mongoose.Schema({
    packageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: ''
    },

}, { timestamps: true });

export default mongoose.model('franchisePackageLog', franchisePackageLogSchema);
