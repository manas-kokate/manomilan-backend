import { model, Schema } from "mongoose";

const userSchema = new Schema({
    // Login credentials
    UserId: { type: Number },
    loginEmail: { type: String, required: true, unique: true },
    loginNumber: { type: String, required: true, unique: true },
    password: { type: Number, required: true },
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
    height: { type: Number, default: "100" },//centimeters
    occupation: {
        type: String,
    },
    monthlyIncome: { type: Number },
    nationality: { type: [String], default: ["India"] },
    caste: {
        religion: String,
        caste: String,
        subCaste: String
    },//"Hindu,Maratha,Kunbi"
    motherTongue: { type: String },
    divyang: { type: String },//Yes or No
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
    nativeVillage: {
        type: String
    },
    nativeCity: {
        country: { type: String },
        state: { type: String },
        city: { type: String }
    },
    workAbroad: { type: String },//Yes or No

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
    expectedMonthlyIncome: { type: Number },//10000 stored in db but while matching should match greater than or equal to this value
    expectedWorkAbroad: { type: String },//Yes or No
    divyangPrefer: { type: String },//Yes or No
    expectedMaritalStatus: { type: String },
    expectedNationality: { type: [String] },// values can be ["ANY"] or ["Indian","American"]
    childAccepted: { type: String },//Yes or No
    expectedReligion: [{
        religion: {
            type: String
        },
        caste: {
            type: String
        },
        subCaste: {
            type: String
        }
    }],
    expectedNativeLocation: [{
        country: { type: String },
        state: { type: String },
        city: { type: String }
    }],//values be "ANY" also
    expectedWorkingLocation: [
        {
            country: { type: String },
            state: { type: String },
            city: { type: String }
        }
    ],//values can be "ANY" also 

    // other 
    profilePic: { type: String },
    userPhotoOne: { type: String },
    userPhotoTwo: { type: String },
    userPhotoThree: { type: String },
    userPhotoFour: { type: String },
    userPhotoStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },

    // Special info
    sect: { type: String },
    manglik: { type: String },
    foodPreference: { type: String },
    bloodGroup: { type: String },
    specs: { type: String },
    gotra: { type: String },

    //info to be filled by franchise
    Complexion: { type: String },
    BodyType: { type: String },
    familyBackground: { type: String },
    features: { type: String },
    height: { type: String },
    position: { type: String },
    vipMember: {
        type: Boolean,
        default: false
    },
    Reference: { type: String },
    ReferenceMobile: { type: String },

    // addresses available
    numberOfAddresses: {
        type: Number
    },
}, { timestamps: true });

export default model("user", userSchema);
