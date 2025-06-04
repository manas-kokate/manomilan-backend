import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
    loginEmail: {
        type: String,
        required: true,
        unique: true
    },
    loginNumber: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: { type: String },
    middleName: { type: String },
    lastName: { type: String },
    gender: {
        type: String,
        enum: ['male', 'female']
    },
    dob: { type: Date },
    birthTime: { type: String },
    placeOfBirth: {
        type: String,
        minlength: 2,
        maxlength: 30
    },
    maritalStatus: {
        type: String,
        enum: ['Unmarried', 'Divorced', 'Widowed', 'DivorceinProcess'],
        default: 'Unmarried'
    },
    childrenNum: {
        type: Number,
    },
    childGender: {
        type: [String],
    },
    childDob: {
        type: [String],
    },
    livingWith: {
        type: String,
    },
    height: { type: String },
    occupation: {
        type: String,
        enum: ['government service', 'privateService', 'service+bussiness', 'business', 'studentInternship', 'notWorking']
    },
    designation: { type: String },
    companyName: { type: String },
    personalNo: { type: String },
    workcity: { type: String },
    workstate: { type: String },
    monthlyIncome: {
        type: String,
        maxlength: 8
    },
    nationality: {
        type: String,
        default: 'India'
    },
    caste: { type: String },
    motherTongue: {
        type: String,
        default: 'Marathi'
    },
    fatherName: { type: String },
    motherName: { type: String },
    mamkul: { type: String },
    parentNumber: {
        type: String,
        minlength: 10,
        maxlength: 10
    },
    wpNo: {
        type: String,
        minlength: 10,
        maxlength: 10
    },
    alternateNo: {
        type: String,
        minlength: 10,
        maxlength: 10
    },
    brother: { type: String },
    brotherText: { type: String },
    sister: { type: String },
    sisterText: { type: String },
    divyang: {
        type: String,
        enum: ['yes', 'no'],
        default: 'no'
    },
    education: { type: [String] },
    addressHome: {
        type: String,
        minlength: 10,
        maxlength: 150
    },
    homecity: { type: String },
    otherInfo: { type: String },
    sect: {
        type: String,
        enum: ['mahanubhav', 'kabir panthi', 'warkari', 'malkari']
    },
    manglik: {
        type: String,
        enum: ['manglik', 'non-manglik', 'partial manglik(soumya mangal)']
    },
    gotra: { type: String },
    foodChoices: {
        type: String,
        enum: ['vegetarian', 'non-vegetarian', 'mixed']
    },
    spectacles: {
        type: String,
        enum: ['Yes', 'No']
    },
    bloodGroup: { type: String },
    complexion: { type: String },
    userPhoto: { type: String },
    profilePicStatus: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    // Partner preferences
    ageFrom: { type: String },
    ageTo: { type: String },
    heightFrom: { type: String },
    heightTo: { type: String },
    partnerIncome: { type: String },
    abroad: { type: String, default: 'no' },
    issue: { type: String },
    partnerMaritalStatus: { type: String },
    partnerNationality: { type: String },
    partnerOccupation: { type: String },
    partnerEducation: { type: [String] },
    nativePlaceCities: { type: [String] },
    nativePlaceStates: { type: [String] },
    nativePlaceCountries: { type: [String] },
    workingLocationCountries: { type: [String] },
    workingLocationStates: { type: [String] },
    workingLocationCities: { type: [String] },
    religion: { type: [String] },
    subCaste: { type: [String] },
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

userSchema.method.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

export default model('user', userSchema);
