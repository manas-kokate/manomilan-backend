import franchiseModel from "../models/franchise.model.js";
import userModel from "../models/user.model.js"
import jwt from "jsonwebtoken";
import envCredentials from "../config/env.js";
import distributorModel from "../models/distributor.model.js";
import MessageModel from "../models/small_models/message.model.js";
import adminModel from "../models/admin.model.js";
import freepackageModel from '../models/small_models/freepackage.model.js'
import addOnPackageModel from "../models/small_models/addOnPackage.model.js";
import mainPackageModel from "../models/small_models/mainPackage.model.js";
import vippackageModel from "../models/small_models/vippackage.model.js";
import userPackageTrackModel from "../models/small_models/userPackageTrack.model.js";

export const registerFranchise = async (req, res) => {
    const distributorId = req.id;
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
        location,
        socialMedia
    } = req.body;

    if (!franchiseName || !ownerName || !mobileNumber || !adharNumber || !panNumber || !email || !address) {
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


    try {
        const currentDistributor = await distributorModel.findById(distributorId);
        const newSchema = new franchiseModel({
            franchiseName,
            ownerName,
            distributorUnder: currentDistributor.distributorName,
            mobileNumber,
            alternateNumber,
            adharNumber,
            panNumber,
            password,
            email,
            address,
            location,
            socialMedia,
            franchisePhoto,
            qrPhoto
        })
        await newSchema.save()
        return res.send({ status: true, message: "Franchise registered successfully" });
    } catch (error) {
        return res.send({ status: false, message: "Something went wrong. Send data properly." })
    }
}

export const loginFranchise = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        if (!identifier || !password) {
            return res.send({ status: false, message: "identifier and password are required" });
        }

        // identifier can be adharNumber, panNumber, or email
        const franchise = await franchiseModel.findOne({
            $or: [
                { adharNumber: identifier },
                { panNumber: identifier },
                { email: identifier },
                { mobileNumber: identifier }
            ]
        });

        if (password != franchise.password) {
            return res.send({ status: false, message: "Invalid password" })
        }

        if (!franchise) {
            return res.send({ status: false, message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: franchise._id },
            envCredentials.secretKey,
            { expiresIn: "4h" }
        );

        return res.send({ status: true, message: "Login successful", data: franchise, token: token });
    } catch (error) {
        return res.send({ status: false, message: "Server Error" })
    }
};

export const updateFranchiseProfile = async (req, res) => {
    const { franchiseId } = req.id;
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
            // Login credentials
            loginEmail,
            loginNumber,
            password,

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
            !password) {
            return res.send({ status: false, message: "Login credentials required to register" });
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
        const currentFranchise = await franchiseModel.findById(req.id)
        if (!currentFranchise) {
            return res.send({ status: false, message: "Franchise not found" })
        }

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
            CreatedBy: currentFranchise.franchiseName,
            franchiseUnder: currentFranchise.franchiseName,

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

export const viewMember = async (req, res) => {
    try {
        const franchiseId = req.id;
        const currentFranchise = await franchiseModel.findById(franchiseId);

        const lowerLimit = parseInt(req.query.lowerLimit) || 0;  // start from 0
        const upperLimit = parseInt(req.query.upperLimit) || 10; // number of results

        const allUsers = await userModel
            .find({ CreatedBy: currentFranchise.franchiseName }, '-_id -__v -franchiseUnder -createdBy -password')
            .skip(lowerLimit)
            .limit(upperLimit);

        return res.send({ status: true, result: allUsers });

    } catch (error) {
        console.error(error);
        return res.send({ status: false, message: "Server Error" });
    }
}

export const getSingleUser = async (req, res) => {
    try {
        const franchiseId = req.id;
        const { userId } = req.params;
        if (!userId) {
            return res.send({ status: false, message: "User Id not found" })
        }
        const franchise = await franchiseModel.findById(franchiseId);
        const user = await userModel.findById(userId);
        const isUnderFranchise = user?.franchiseUnder === franchise.franchiseName ? true : false;
        if (!isUnderFranchise) {
            return res.send({ status: false, message: 'Sorry this user is not under your frachise. Contact admin.' });
        }
        return res.send({ status: true, user })
    } catch (error) {
        return res.send({ status: false, message: "Server error" })
    }
}

// === MESSAGES === 

export const getDistributorAndAdmin = async (req, res) => {
    const franchiseId = req.id;
    const franchise = await franchiseModel.findById(franchiseId);

    const users = await userModel.find({ franchiseUnder: franchise.franchiseName })
    const distributor = await distributorModel.find({ distributorName: franchise.distributorUnder })
    const admin = await adminModel.find({}, '-points -transactionPassword -givePointsPassword -password -__v -createdAt -updatedAt')

    return res.send({ status: true, distributor, admin, users })
}

export const sendMessageFromFranchise = async (req, res) => {
    try {
        const getUserNameById = async (id) => {
            let user = await adminModel.findById(id) || await distributorModel.findById(id) || await franchiseModel.findById(id) || await userModel.findById(id);
            return user
                ? user.firstName
                    ? `${user.firstName} ${user.midname} ${user.lastName}`
                    : user.franchiseName || user.distributorName || user.name
                : 'Unknown';
        };

        const senderId = req.id;
        const { receiverIds, message } = req.body;

        if (!message) return res.send({ status: false, message: "Message content is missing" });
        if (!receiverIds || receiverIds.length === 0) return res.send({ status: false, message: "Receiver IDs are missing" });

        const franchise = await franchiseModel.findById(senderId);
        if (!franchise) return res.send({ status: false, message: "Franchise not found" });

        const to = await Promise.all(receiverIds.map(id => getUserNameById(id)));

        const newMessage = new MessageModel({
            senderId,
            receiverId: receiverIds,
            from: franchise.franchiseName || 'Franchise User',
            to,
            message,
            status: 'sent'
        });

        await newMessage.save();
        return res.send({ status: true, message: "Message sent successfully" });
    } catch (error) {
        return res.send({ status: false, message: "Error sending message", error });
    }
};

export const draftMessageFromFranchise = async (req, res) => {
    try {
        const getUserNameById = async (id) => {
            let user = await adminModel.findById(id) || await distributorModel.findById(id) || await franchiseModel.findById(id) || await userModel.findById(id);
            return user
                ? user.firstName
                    ? `${user.firstName} ${user.midname} ${user.lastName}`
                    : user.franchiseName || user.distributorName || user.name
                : 'Unknown';
        };

        const senderId = req.id;
        const { receiverIds, message } = req.body;

        if (!message) return res.send({ status: false, message: "Message content is missing" });
        if (!receiverIds || receiverIds.length === 0) return res.send({ status: false, message: "Receiver IDs are missing" });

        const franchise = await franchiseModel.findById(senderId);
        if (!franchise) return res.send({ status: false, message: "Franchise not found" });

        const to = await Promise.all(receiverIds.map(id => getUserNameById(id)));

        const draftMessage = new MessageModel({
            senderId,
            receiverId: receiverIds,
            from: franchise.franchiseName || 'Franchise User',
            to,
            message,
            status: 'drafted'
        });

        await draftMessage.save();
        return res.send({ status: true, message: "Message drafted successfully" });
    } catch (error) {
        return res.send({ status: false, message: "Error drafting message", error });
    }
};

export const getSentMessagesForFranchise = async (req, res) => {
    try {
        const senderId = req.id;

        const messages = await MessageModel.find({
            senderId,
            status: 'sent'
        }).sort({ createdAt: -1 });

        return res.send({ status: true, data: messages });
    } catch (error) {
        return res.send({ status: false, message: "Error fetching sent messages", error });
    }
};

export const getDraftedMessagesForFranchise = async (req, res) => {
    try {
        const senderId = req.id;

        const drafts = await MessageModel.find({
            senderId,
            status: 'drafted'
        }).sort({ updatedAt: -1 });

        return res.send({ status: true, data: drafts });
    } catch (error) {
        return res.send({ status: false, message: "Error fetching drafted messages", error });
    }
};

export const getRepliesForFranchise = async (req, res) => {
    try {
        const userId = req.id;

        const replies = await MessageModel.find({
            receiverId: userId,
            status: 'sent'
        }).sort({ createdAt: -1 });

        return res.send({ status: true, data: replies });
    } catch (error) {
        return res.send({ status: false, message: "Error fetching replies", error });
    }
};

// === ALLOT PACKAGE ===

export const getAllActivePackages = async (req, res) => {
    try {
        const freepackages = await freepackageModel.findOne({ status: 'Active' })
        const addOnPackages = await addOnPackageModel.findOne({ status: 'Active' })
        const mainPackages = await mainPackageModel.findOne({ status: 'Active' })
        const vipPackages = await vippackageModel.findOne({ status: 'Active' })
        return res.send({ status: true, freepackages, addOnPackages, mainPackages })
    }
    catch (err) {
        return res.send({ status: false, message: "Server error" })
    }
}

export const getUserAllotedPackages = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.send({ status: false, message: "User Id required" })
        }
        const userPackageLog = await userPackageTrackModel.findOne({ userId }).populate(['vipPackage', 'addOnPackage', 'mainPackage', 'freePackage'])
        if (!userPackageLog) {
            return res.send({ status: false, message: "Something went wrong. User package details not found" })
        }
        return res.send({ status: true, userPackageLog });
    } catch (error) {
        return res.send({ status: false, message: "Server error." })
    }
}

export const allotPackage = async (req, res) => {
    const { allotPackageIds, userId } = req.body;
    if (allotPackageIds.length === 0) {
        return res.send({ status: false, message: "No allotment IDs found" })
    }
    const userPackage = await userPackageTrackModel.findOne({ userId });
    const MainPackages = await Promise.all(allotPackageIds.map(async (ele) => {
        return await mainPackageModel.findById(ele)
    }))

    const addOnPackages = await Promise.all(allotPackageIds.map(async (ele) => {
        return await addOnPackageModel.findById(ele)
    }))
    return res.send({ MainPackages, addOnPackages });
}

