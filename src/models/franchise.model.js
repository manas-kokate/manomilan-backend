import mongoose from 'mongoose';

const franchiseSchema = new mongoose.Schema({
    franchiseName: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    ownerName: {
        type: String,
        required: true,
        trim: true,
    },
    distributorUnder: {
        type: String,
        required: true,
    },
    mobileNumber: {
        type: String,
        required: true,
        unique: true,
    },
    alternateNumber: {
        type: String,
    },
    adharNumber: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        // match: /^\d{12}$/,
    },
    panNumber: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        default: 0
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    address: {
        type: String,
        required: true,
        trim: true,
    },
    location: {
        type: String
    },
    franchisePhoto: {
        type: String
    },
    qrPhoto: {
        type: String
    },
    socialMedia: {
        facebook: { type: String },
        instagram: { type: String },
        twitter: { type: String },
        linkedin: { type: String },
        website: { type: String }
    },
    Status: {
        type: String,
        default: 'active'
    }
}, { timestamps: true });


export default mongoose.model('Franchise', franchiseSchema);
