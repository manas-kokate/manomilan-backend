import franchiseModel from "../models/franchise.model.js";
import userModel from "../models/user.model.js"
import jwt from "jsonwebtoken";
import envCredentials from "../config/env.js";


export const registerFranchise = async (req, res) => {
    const {
        franchiseName,
        ownerName,
        mobileNumber,
        alternateNumber,
        adharNumber,
        panNumber,
        password,
        email,
        address,
        socialMedia
    } = req.body;

    if (!franchiseName || !ownerName || !mobileNumber || !adharNumber || !panNumber || !email || !address || !socialMedia) {
        return res.send({ status: false, message: "All fields required" })
    }

    const existingUser = await franchiseModel.findOne({
        $or: [{ adharNumber }, { panNumber }, { email }, { mobileNumber }]
    })

    if (existingUser) {
        return res.send({ status: false, message: "Sorry user already exists." })
    }

    let franchisePhoto = '';
    let qrPhoto = '';
    try {
        if (
            (req.files?.franchisePhoto || req.files.franchisePhoto.length !== 0) && (req.files?.qrPhoto || req.files.qrPhoto.length !== 0)) {
            franchisePhoto = req.files.franchisePhoto[0].filename;
            qrPhoto = req.files.qrPhoto[0].filename;
        }
    } catch (error) {
        franchisePhoto = '';
        qrPhoto = '';
    }

    const newSchema = new franchiseModel({
        franchiseName,
        ownerName,
        mobileNumber,
        alternateNumber,
        adharNumber,
        panNumber,
        password,
        email,
        address,
        socialMedia,
        franchisePhoto,
        qrPhoto
    })

    await newSchema.save()

    return res.send({ status: false, message: "Franchise regisered successfully" });

}

export const loginFranchise = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        if (!identifier || !password) {
            return res.send({ status: false, message: "identifier and password are required" });
        }

        // identifier can be adharNumber, panNumber, or email
        const franchise = await franchiseModel.findOne({
            mobileNumber,
            $or: [
                { adharNumber: identifier },
                { panNumber: identifier },
                { email: identifier },
                { mobileNumber: identifier }
            ]
        });

        if (!franchise) {
            return res.send({ status: false, message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: franchise._id },
            envCredentials.secretKey,
            { expiresIn: "1h" }
        );

        return res.send({ status: true, message: "Login successful", data: franchise, token: token });
    } catch (error) {
        return res.send({ status: false, message: "Server Error" })
    }
};

export const updateFranchiseProfile = async (req, res) => {
    const { franchiseId } = req.params;
    const updateData = req.body;

    if (!franchiseId) {
        return res.send({ status: false, message: "Franchise ID is required" });
    }

    if (!updateData) {
        return res.send({ status: false, message: "Please send update data" })
    }

    try {
        const existingFranchise = await franchiseModel.findById(franchiseId);

        if (!existingFranchise) {
            return res.send({ status: false, message: "Franchise not found" });
        }

        // Handle file uploads
        if (req.files?.franchisePhoto?.[0]) {
            updateData.franchisePhoto = req.files.franchisePhoto[0].filename;
        }

        if (req.files?.qrPhoto?.[0]) {
            updateData.qrPhoto = req.files.qrPhoto[0].filename;
        }

        const updatedFranchise = await franchiseModel.findByIdAndUpdate(
            franchiseId,
            updateData,
            { new: true }
        );

        return res.send({ status: true, message: "Profile updated successfully", data: updatedFranchise });

    } catch (error) {
        return res.status(500).send({ status: false, message: "Something went wrong", error: error.message });
    }
};

export const createMember = async (req, res) => {
    try {
        const {

            //loggedIn franchise 

            // Login credentials
            loginEmail,
            loginNumber,
            password,
            CreatedBy,
            franchiseUnder,

            // Personal Info
            firstName,
            lastName,
            midname,
            gender,
            dob,
            timeOfBirth,
            placeOfBirth,
            maritalStatus,
            children,
            height,
            occupation,
            monthlyIncome,
            nationality,
            caste,
            motherTongue,
            divyang,
            mothersName,
            fathersName,
            mamkul,
            parentsResidence,
            parentsCity,
            parentsContact,
            whatsApp,
            alternateNumber,
            brothersCount,
            brothers,
            sisters,
            sistersExactCount,
            otherInfo,

            // Education & Career
            education,
            companyName,
            designation,
            candidateNumber,
            candidateEmail,
            workLocation,
            isWorking,

            // Expectations
            ageFrom,
            ageTo,
            heightFrom,
            heightTo,
            expectedEducation,
            expectedOccupation,
            expectedIncome,
            workAbroad,
            expectedMaritalStatus,
            expectedNationality,
            childAccepted,
            religion,
            nativeLocation,
            workingLocation,

            // Special Info
            sect,
            manglik,
            gotra,
            foodPreference,
            specs,
            bloodGroup,
        } = req.body;

        if (!loginEmail ||
            !loginNumber ||
            !password ||
            !CreatedBy ||
            !franchiseUnder) {
            return res.send({ status: false, message: "Login credentials required to register" })
        }

        // Check if user already exists by email or number
        const existingUser = await userModel.findOne({
            $or: [{ loginEmail }, { loginNumber }]
        });

        if (existingUser) {
            return res.status(400).send({
                status: false,
                message: "User already exists with this email or number.",
            });
        }

        // Handle profile pic
        let userPhoto = '';
        try {
            if (req.files?.profilePic || req.files.profilePic.length !== 0) {
                userPhoto = req.files.profilePic[0].filename
            }
        } catch (err) {
            userPhoto = '';
        }

        //Get Currently loggedIn franchise
        const CurrentFranchise = await franchiseModel.findOne({})

        //New Unique Id 
        const LastIdUser = await userModel.findOne().sort({ UserId: -1 });
        const UserId = LastIdUser ? Number(LastIdUser.UserId) + 1 : 1;

        // Create user document
        const user = new userModel({
            // Login credentials
            UserId,
            loginEmail,
            loginNumber,
            password,
            CreatedBy: "",
            franchiseUnder,

            // Personal Info
            firstName,
            lastName,
            midname,
            gender,
            dob,
            timeOfBirth,
            placeOfBirth,
            maritalStatus,
            children,
            height,
            occupation,
            monthlyIncome,
            nationality,
            caste,
            motherTongue,
            divyang,
            mothersName,
            fathersName,
            mamkul,
            parentsResidence,
            parentsCity,
            parentsContact,
            whatsApp,
            alternateNumber,
            brothersCount,
            brothers,
            sisters,
            sistersExactCount,
            otherInfo,

            // Education & Career
            education,
            companyName,
            designation,
            candidateNumber,
            candidateEmail,
            workLocation,
            isWorking,

            // Expectations
            ageFrom,
            ageTo,
            heightFrom,
            heightTo,
            expectedEducation,
            expectedOccupation,
            expectedIncome,
            workAbroad,
            expectedMaritalStatus,
            expectedNationality,
            childAccepted,
            religion,
            nativeLocation,
            workingLocation,

            // Special Info
            sect,
            manglik,
            gotra,
            foodPreference,
            specs,
            bloodGroup,
        });

        await user.save();

        return res.status(201).send({
            status: true,
            message: "User registered successfully.",
        });

    } catch (error) {
        console.error("Registration Error:", error);
        return res.status(500).send({
            status: false,
            message: "Server Error",
            error: error.message,
        });
    }
}