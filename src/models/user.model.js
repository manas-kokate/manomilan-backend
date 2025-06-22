import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
    // Login credentials
    UserId: { type: Number },
    loginEmail: { type: String, required: true, unique: true },
    loginNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    ActiveStatus: { type: Boolean, default: true },
    CreatedBy: { type: String, required: true },
    franchiseUnder: { type: String, required: true },

    // Personal Info
    firstName: { type: String },
    lastName: { type: String },
    midname: { type: String },
    gender: { type: String, enum: ["male", "female"] },
    dob: { type: Date },
    timeOfBirth: { type: String },
    placeOfBirth: { type: String },
    maritalStatus: {
        type: String,
    },
    children: [{
        dob: { type: String },
        gender: { type: String },
        livesWith: { type: String }
    }],
    height: { type: String, default: "5' 4\"" },
    occupation: {
        type: String,
    },
    monthlyIncome: { type: String },
    nationality: { type: [String], default: ["India"] },
    caste: { type: String },
    motherTongue: { type: String },
    divyang: { type: String },
    mothersName: { type: String },
    fathersName: { type: String },
    mamkul: { type: String },
    parentsResidence: { type: String },
    parentsCity: { type: String },
    parentsContact: { type: Number },
    whatsApp: { type: Number },
    alternateNumber: { type: String },
    brothersCount: { type: Number },
    brothers: { type: String },
    sisters: { type: String },
    sistersExactCount: { type: Number },
    otherInfo: { type: String },

    // Education & Career
    education: { type: [String] },
    companyName: { type: String },
    designation: { type: String },
    candidateNumber: { type: String },
    candidateEmail: { type: String },
    workLocation: { type: String },
    isWorking: { type: Boolean, default: true },

    // Expectations
    ageFrom: { type: String },
    ageTo: { type: String },
    heightFrom: { type: String },
    heightTo: { type: String },
    expectedEducation: { type: [String] },
    expectedOccupation: { type: String },
    expectedIncome: { type: String },
    workAbroad: { type: String },
    divyangPrefer: { type: String },
    expectedMaritalStatus: { type: String },
    expectedNationality: { type: [String] },
    childAccepted: { type: String },
    religion: { type: [String] },
    nativeLocation: { type: [String] },
    workingLocation: { type: [String] },
    userPhotoOne: { type: String },

    // Special info
    sect: { type: String },
    manglik: { type: String },
    foodPreference: { type: String },
    bloodGroup: { type: String },
    specs: { type: String },
    gotra: { type: String },
    userPhoto: { type: String },
    userPhotoStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
}, { timestamps: true });

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Password comparison method
userSchema.method.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

export default model("user", userSchema);
