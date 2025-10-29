import mongoose from "mongoose"
import bcrypt from 'bcrypt'

const distributorSchema = new mongoose.Schema({
    distributorName: {
        type: String,
        required: true,
        trim: true,
    },
    ownerName: {
        type: String,
        required: true,
    },
    points: {
        type: Number,
        default: 0
    },
    mobileNumber: {
        type: String,
        required: true,
        // match: /^[6-9]\d{9}$/,
    },
    alternateNumber: {
        type: String,
        match: /^[6-9]\d{9}$/,
    },
    adharNumber: {
        type: String,
        required: true,
        trim: true,
        // match: /^\d{12}$/,
    },
    panNumber: {
        type: String,
        required: true,
        // match: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        // match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    },
    address: {
        type: String,
        required: true,
        trim: true,
    },
    distributorPhoto: {
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
    },
    address: {
        type: String
    },
    location: {
        type: String
    },
    pincode: {
        type: Number
    },
    transactionPassword: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
    }
}, { timestamps: true });

distributorSchema.pre("save", async function (next) {
    if (this.isModified('transactionPassword')) {
        this.transactionPassword = await bcrypt.hash(this.transactionPassword, 10)
    }
    next()
})

export default mongoose.model('distributor', distributorSchema)