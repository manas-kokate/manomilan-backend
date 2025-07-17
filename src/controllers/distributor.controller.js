import distributorModel from "../models/distributor.model.js";
import jwt from "jsonwebtoken"
import envCredentials from "../config/env.js";
import userModel from "../models/user.model.js";

export const registerDistributor = async (req, res) => {
    const {
        distributorName,
        ownerName,
        mobileNumber,
        alternateNumber,
        adharNumber,
        panNumber,
        password,
        email,
        address,
        location,
        socialMedia,
        pincode
    } = req.body;

    const ExistingDistributor = await distributorModel.findOne({
        $or: [
            { distributorName },
            { mobileNumber },
            { adharNumber },
            { panNumber },
            { email }
        ]
    });
    if (ExistingDistributor) {
        return res.send({ status: false, messsage: "Distributor already exists with this details." })
    }

    let qrPhoto;
    let distributorPhoto;


    try {
        if (req.files?.qrPhoto || req.files?.qrPhoto?.length !== 0) {
            qrPhoto = req.files.qrPhoto[0].filename;
        }
    } catch (error) {
        qrPhoto = ''
    }

    try {
        if (req.files?.distributorPhoto || req.files?.distributorPhoto?.length !== 0) {
            distributorPhoto = req.files.distributorPhoto[0].filename
        }
    } catch (error) {
        distributorPhoto = ''
    }

    try {
        const newDistributor = new distributorModel({
            distributorName,
            ownerName,
            mobileNumber,
            alternateNumber,
            adharNumber,
            panNumber,
            password,
            email,
            address,
            location,
            distributorPhoto,
            qrPhoto,
            socialMedia,
            pincode
        })
        await newDistributor.save();
        return res.send({ status: true, message: "Distributor registered successfully" })
    } catch (error) {
        return res.send({ status: false, message: "Something went wrong. Send details properly." })
    }
}

export const loginDistributor = async (req, res) => {
    try {
        const { identifier, password } = req.body;
        let distributor = await distributorModel.findOne({ email: identifier });
        if (!distributor) {
            distributor = await distributorModel.findOne({ mobileNumber: identifier })
        }
        // console.log(distributor.password, password)

        if (!distributor) {
            return res.status(401).json({ status: false, message: "Invalid mobile number or email" });
        }

        // Compare passwords
        if (password != distributor.password) {
            return res.status(401).json({ status: false, message: "Invalid password" });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: distributor._id },
            envCredentials.secretKey,
            { expiresIn: "4h" }
        );

        return res.json({
            status: true,
            message: "Login successful",
            token,
            distributor
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: "Server error" });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const lowerLimit = parseInt(req.params.lowerLimit) || 0;
        const upperLimit = parseInt(req.params.upperLimit) || 20;

        const users = await userModel.find().skip(lowerLimit).limit(upperLimit);

        if (users.length == 0) {
            return res.send({ status: false, message: "No users found" });
        }

        return res.send({ status: true, users })

    } catch (error) {
        return res.send({ status: false, message: "Something went wrong. Internal server error" })
    }

}


export const sendMessageFromDistributor = async (req, res) => {
    try {
        const { distributorId, userName, franchiseName, adminName, message } = req.body;

        if (!userName && !franchiseName && !adminName) {
            return res.send({ status: false, message: "Please select a recipient" });
        }

        if (!distributorId || !message) {
            return res.send({ status: false, message: "Distributor ID and message are required." });
        }

        const newMessage = new MessageModel({
            distributorId,
            isReply: false,  // original message
            userName,
            franchiseName,
            adminName,
            message,
            status: 'sent'
        });

        await newMessage.save();

        return res.send({ status: true, message: "Message sent successfully." });

    } catch (error) {
        console.error("Error sending message from distributor:", error);
        return res.send({ status: false, message: "Server error. Message not sent." });
    }
};

// ➤ Save draft (NOT a reply)
export const draftMessageFromDistributor = async (req, res) => {
    try {
        const { distributorId, userName, franchiseName, adminName, message } = req.body;

        if (!userName && !franchiseName && !adminName) {
            return res.send({ status: false, message: "Please select a recipient" });
        }

        if (!distributorId || !message) {
            return res.send({ status: false, message: "Distributor ID and message are required." });
        }

        const newMessage = new MessageModel({
            distributorId,
            isReply: false,  // original message
            userName,
            franchiseName,
            adminName,
            message,
            status: 'draft'
        });

        await newMessage.save();

        return res.send({ status: true, message: "Message saved to drafts successfully." });

    } catch (error) {
        console.error("Error saving draft from distributor:", error);
        return res.send({ status: false, message: "Server error. Message not saved." });
    }
};

// ➤ Get sent messages
export const getSentMessagesFromDistributor = async (req, res) => {
    try {
        const distributorId = req.params.distributorId;

        const sentMessages = await MessageModel.find({
            distributorId,
            status: 'sent',
            isReply: false
        }).sort({ createdAt: -1 });

        if (sentMessages.length === 0) {
            return res.send({ status: false, message: "No sent messages found." });
        }

        return res.send({ status: true, messages: sentMessages });

    } catch (error) {
        console.error("Error fetching distributor sent messages:", error);
        return res.send({ status: false, message: "Server error" });
    }
};

// ➤ Get draft messages
export const getDraftMessagesFromDistributor = async (req, res) => {
    try {
        const distributorId = req.params.distributorId;

        const draftMessages = await MessageModel.find({
            distributorId,
            status: 'draft',
            isReply: false
        }).sort({ createdAt: -1 });

        if (draftMessages.length === 0) {
            return res.send({ status: false, message: "No draft messages found." });
        }

        return res.send({ status: true, messages: draftMessages });

    } catch (error) {
        console.error("Error fetching distributor draft messages:", error);
        return res.send({ status: false, message: "Server error" });
    }
};

// ➤ Get replies received by distributor (replies = isReply: true)
export const getRepliesForDistributor = async (req, res) => {
    try {
        const distributorId = req.params.distributorId;

        const replies = await MessageModel.find({
            distributorId,
            status: 'sent',
            isReply: true
        }).sort({ createdAt: -1 });

        if (replies.length === 0) {
            return res.send({ status: false, message: "No replies found." });
        }

        return res.send({ status: true, messages: replies });

    } catch (error) {
        console.error("Error fetching replies for distributor:", error);
        return res.send({ status: false, message: "Server error" });
    }
};