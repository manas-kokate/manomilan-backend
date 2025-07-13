import { Schema, model } from "mongoose";
import bcrypt from "bcrypt"

const adminSchema = new Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    transactionPassword: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        default: 0
    },
}, { timestamps: true })

adminSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10)
    }
    next()
})
adminSchema.pre('save', async function (next) {
    if (this.isModified('transactionPassword')) {
        this.transactionPassword = await bcrypt.hash(this.transactionPassword, 10)
    }
    next()
})

export default model('admin', adminSchema)