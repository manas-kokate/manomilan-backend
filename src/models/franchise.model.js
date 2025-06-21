import mongoose from 'mongoose';

const franchiseSchema = new mongoose.Schema({
    franchiseName: {
        type: String,
        required: true,
        trim: true,
    },
    ownerName: {
        type: String,
        required: true,
        trim: true,
    },
    mobileNumber: {
        type: String,
        required: true,
        match: /^[6-9]\d{9}$/,
    },
    alternateNumber: {
        type: String,
        match: /^[6-9]\d{9}$/,
    },
    adharNumber: {
        type: String,
        required: true,
        match: /^\d{12}$/,
    },
    panNumber: {
        type: String,
        required: true,
        match: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    },
    address: {
        type: String,
        required: true,
        trim: true,
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
    }
}, { timestamps: true });

export default mongoose.model('Franchise', franchiseSchema);
