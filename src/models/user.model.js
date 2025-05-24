import { model, Schema } from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new Schema({
    usName: {
        type: String,
        required: true,
        unique: true
    },
    contactLogin: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    fsname: { type: String, required: true },
    mdname: { type: String },
    lsname: { type: String, required: true },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female', 'other']
    },
    dob: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    placeofbirth: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30
    },
    maritalsts: {
        type: String,
        required: true,
        enum: ['unmarried', 'divorced', 'widowed', 'being divorced'],
        default: 'unmarried'
    },
    height: {
        type: String,
        required: true
    },
    occupation: {
        type: String,
        required: true,
        enum: ['government service', 'private sector', 'service+bussiness', 'student', 'internship', 'other']
    },
    jobPosition: { type: String },
    companyOrgName: { type: String },
    designation: { type: String },
    workaddress: { type: String },
    workcity: { type: String },
    workstate: { type: String },
    monthlyinc: {
        type: String,
        required: false,
        maxlength: 8
    },
    nationality: {
        type: String,
        required: true,
        default: 'Indian'
    },
    caste: {
        type: String
    },
    mothertongue: {
        type: String,
        required: true,
        default: 'marathi'
    },
    fathername: {
        type: String,
        required: true
    },
    mothername: {
        type: String,
        required: true
    },
    mamkul: {
        type: String
    },
    parentnumber: {
        type: String,
        minlength: 10,
        maxlength: 10
    },
    wpno: {
        type: String,
        minlength: 10,
        maxlength: 10
    },
    alternateno: {
        type: String,
        minlength: 10,
        maxlength: 10
    },
    brother: { type: String },
    sister: { type: String },
    divyang: {
        type: String,
        required: true,
        enum: ['Yes', 'No']
    },
    education: {
        type: [String],
        required: true
    },
    candidateNo: {
        type: String
    },
    parentaddress: {
        type: String,
        minlength: 10,
        maxlength: 150
    },
    parentcity: { type: String },
    parentstate: { type: String },
    matchAgeFrom: { type: String },
    matchAgeTo: { type: String },
    matchHeightFrom: { type: String },
    matchHeightTo: { type: String },
    prefEdu: { type: String },
    matchOccu: { type: String },
    matchMaritalSts: { type: String },
    matchIncome: { type: String },
    matchCaste: { type: String },
    matchWorkLocCitDis: { type: String },
    franchise: { type: String },
    PartnerDesc: {
        type: String,
        maxlength: 500
    },
    socials: { type: String },
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
    spects: {
        type: String,
        enum: ['Yes', 'No']
    },
    complexion: { type: String },
    hobbies: { type: String },
    profilePic: {
        type: String,
        default: null
    },
    profilePicStatus: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    }
});



userSchema.pre("save", async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10)
    }
    next()
})

userSchema.method.comparePassword = async function (password) {
    return await bcrypt.compare(this.password, password)
}

export default model('user', userSchema)