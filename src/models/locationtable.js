import mongoose from "mongoose";

const locationTableSchema = new mongoose.Schema({
    srNo: { type: Number, required: true },
    state: { type: String, required: true },
    village: { type: String },
    city: { type: String, required: true },
    district: { type: String, required: true },
    country: { type: String, required: true },
    pincode: { type: String, required: true }
})

export default mongoose.model('location', locationTableSchema)