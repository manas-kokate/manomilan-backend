import { model, Schema } from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new Schema({
    name: {
        type: String, required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female']
    },
    martialStatus: {
        type: String,
        required: true,
        enum: ['unmarried', 'divorced', 'widowed', 'being divorced'],
        default: ['unmarried']
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    timeOfBirth: {
        type: String,
        required: true,
    },
    placeOfBirth: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30
    },
    height: {
        type: String,
        required: true,
        default: [`5'4""`]
    },
    education: {
        type: [String],
        required: true
    },
    occupation: {
        type: [String],
        required: true,
        enum: ['government Service', 'private sector', 'service+bussiness', 'student', 'internship'],
        default: ['private secto']
    },
    monthlyIncome: {
        type: String,
        required: true,
        minlength: 0,
        maxlength: 8
    },
    nationality: {
        type: String,
        required: true,
        default: ['Indian']
    },
    religion: {
        type: String,
        required: true,
    },
    motherTongue: {
        type: String,
        required: true,
        default: ['marathi']
    },
    fatherFname: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    motherFname: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    maternalSurname: {
        type: String,
        required: true,
        maxlength: 15,
    },
    NumOfBrother: {
        type: Number,
        required: true,
    },
    NumOfSister: {
        type: Number,
        required: true,
    },
    otherinfo: {
        type: String,
        maxlength: 200
    },
    bloodGroup: {
        type: String,
    },
    sector: {
        type: String,
        required: true,
        enum: ['mahanubhav', 'kabir panthi', 'warkari', 'malkari', 'manglik', 'non-manglik', 'maglik-non-manglik', 'partial manglik(soumya mangal)']
    },
    foodChoice: {
        type: String,
        required: true,
        enum: ['vegetarian', 'non-vegetarian', 'mixed'],
    },
    spects: {
        type: String,
        required: true,
        enum: ['Yes', 'No']
    },
    divyang: {
        type: String,
        required: true,
        enum: ['Yes', 'No']
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    parentsAddress: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 150,
    },
    mobile1: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 10,
    },
    mobile2: {
        type: String,
        minlength: 10,
        maxlength: 10,
    },
    password: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        required: true
    }
})

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