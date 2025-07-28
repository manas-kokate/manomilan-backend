import distributorModel from "../models/distributor.model.js";
import jwt from "jsonwebtoken"
import envCredentials from "../config/env.js";
import userModel from "../models/user.model.js";
import franchiseModel from "../models/franchise.model.js";
import adminModel from "../models/admin.model.js";
import MessageModel from "../models/small_models/message.model.js";
import franchisePointsLogModel from "../models/small_models/franchisePointsLog.model.js";
import bcrypt from 'bcrypt'
import distributorpointslogModel from "../models/small_models/distributorpointslog.model.js";

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
        pincode,
        transactionPassword
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
            pincode,
            transactionPassword
        })
        const distributor = await newDistributor.save();
        return res.send({ status: true, message: "Distributor registered successfully", distributor })
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
        const distributorId = req.id;
        const { lowerLimit } = parseInt(req.body.lowerLimit) || 0;
        const { upperLimit } = parseInt(req.body.upperLimit) || 10;

        const currentDistributor = await distributorModel.findById(distributorId)
        const franchisesUnder = await franchiseModel.find({ distributorUnder: currentDistributor.distributorName });

        if (franchisesUnder.length === 0) {
            return res.send({ status: false, message: 'No franchises found under you.Kindly create or register new franchise.' })
        }

        const franchisesNameArr = franchisesUnder.map((ele) => {
            return ele.franchiseName
        });

        const users = await userModel.find({ franchiseUnder: { $in: franchisesNameArr } }).skip(lowerLimit).limit(upperLimit)

        // console.log(franchisesNameArr)

        if (users.length == 0) {
            return res.send({ status: true, franchisesUnder, users: "No users found" });
        }

        return res.send({ status: true, users })

    } catch (error) {
        return res.send({ status: false, message: "Something went wrong. Internal server error" })
    }

}

export const getCurrentDistributor = async (req, res) => {
    try {
        const { distributorId } = req.body;
        const distributor = await distributorModel.findById(distributorId);
        if (!distributor) {
            return res.send({ status: false, message: "Distributor not found." })
        }
        return res.send({ status: true, distributor })
    } catch (error) {
        return res.send({ status: false, message: "Server error" })
    }

}

export const getSingleFranchise = async (req, res) => {
    try {
        const { franchiseId } = req.body;
        if (!franchiseId) {
            return res.send({ status: false, message: 'Franchise ID not found' })
        }
        const franchise = await franchiseModel.findById(franchiseId);
        return res.send({ status: true, franchise })
    } catch (error) {
        return res.send({ status: false, message: "Server error" })
    }
}

export const getSingleUser = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.send({ status: false, message: "User Id required" })
        }
        const user = await userModel.findById(userId);
        if (!user) {
            return res.send({ status: false, message: "User not found check Id properly." })
        }
        return res.send({ status: true, user })
    } catch (error) {
        return res.send({ status: false, message: "Server error" })
    }
}

// === POINTS ===
export const givePointsToFranchise = async (req, res) => {
    try {
        const distributorId = req.id;
        const { franchiseId, Points, transactionPassword } = req.body;

        if (!franchiseId || !Points) {
            return res.send({ status: false, message: "Franchise Id, points and transactionPassword required" });
        }
        const distributor = await distributorModel.findById(distributorId);
        // if (!(await bcrypt.compare(distributor.transactionPassword, transactionPassword))) {
        //     return res.send({ status: false, message: "Invalid transaction password" })
        // }
        const franchise = await franchiseModel.findById(franchiseId);
        if (!franchise) {
            return res.send({ status: false, message: "Wrong Franchise ID. Franchise not found." })
        }

        if (parseInt(distributor.points) < parseInt(Points)) {
            return res.send({ status: false, message: "You have Insufficient points. Please get more points to allot." })
        }

        distributor.points = parseInt(distributor.points) - parseInt(Points);
        franchise.points = parseInt(franchise.points) + parseInt(Points);

        const newFranchiseLog = await franchisePointsLogModel({
            franchiseId: franchise._id,
            points: Points,
            Type: 'Credited',
            Balance: franchise.points,
            By: distributor.distributorName
        })
        const distributorLog = new distributorpointslogModel({
            distributorId: distributor._id,
            points: -Points,
            Type: 'Debited',
            Balance: distributor.points,
            By: distributor.distributorName
        })
        try {
            await distributor.save();
            await franchise.save();
            await newFranchiseLog.save()
            await distributorLog.save()
            return res.send({ status: true, message: "Points alloted to  franchise." })
        } catch (error) {
            return res.send({ status: false, message: "Points not alloted. Server error." })
        }
    } catch (error) {
        return res.send({ status: false, message: "Server error" })
    }
}

export const getFranchisePointsLog = async (req, res) => {
    try {
        const { franchiseId } = req.params;
        if (!franchiseId) {
            return res.send({ status: false, message: 'franchise Id not found' })
        }
        const franchise = await franchiseModel.findById(franchiseId);
        if (!franchise) {
            return res.send({ status: false, message: "Wrong Id franchise not found." })
        }
        const franchiseLogs = await franchisePointsLogModel.find({
            franchiseId
        }).sort({ createdAt: -1 })
        if (franchiseLogs.length === 0) {
            return res.send({ status: false, message: "No logs found for this franchise" })
        }
        return res.send({ status: true, franchiseLogs })
    } catch (error) {
        return res.send({ status: false, message: "Server error" })
    }
}

// === MESSAGES ===
export const getFranchisesAndAdmin = async (req, res) => {
    try {
        const distributorId = req.id;
        const currentDistributor = await distributorModel.findById(distributorId)
        const franchises = await franchiseModel.find({ distributorUnder: currentDistributor.distributorName });
        const admin = await adminModel.find({}, '-points -transactionPassword -givePointsPassword -password -__v -createdAt -updatedAt')
        return res.send({ status: true, franchises, admin })
    } catch (error) {
        return res.send({ status: false, message: "Server error" })
    }
}

export const getUsers = async (req, res) => {
    try {
        const franchiseName = req.query.franchiseName;
        const franchise = await franchiseModel.findOne({ franchiseName: franchiseName });

        const lowerLimit = parseInt(req.query.lowerLimit) || 0;  // start from 0
        const upperLimit = parseInt(req.query.upperLimit) || 10; // number of results

        const allUsers = await userModel
            .find({ franchiseUnder: franchise.franchiseName })
            .skip(lowerLimit)
            .limit(upperLimit);

        return res.send({ status: true, result: allUsers });

    } catch (error) {
        return res.send({ status: false, message: "Server error" })
    }
}

export const sendMessageFromDistributor = async (req, res) => {
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

        const distributor = await distributorModel.findById(senderId);
        if (!distributor) return res.send({ status: false, message: "Distributor not found" });

        const to = await Promise.all(receiverIds.map(id => getUserNameById(id)));

        const newMessage = new MessageModel({
            senderId,
            receiverId: receiverIds,
            from: distributor.distributorName || 'Distributor User',
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

export const draftMessageFromDistributor = async (req, res) => {
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

        const distributor = await distributorModel.findById(senderId);
        if (!distributor) return res.send({ status: false, message: "Distributor not found" });

        const to = await Promise.all(receiverIds.map(id => getUserNameById(id)));

        const draftMessage = new MessageModel({
            senderId,
            receiverId: receiverIds,
            from: distributor.distributorName || 'Distributor User',
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

export const getSentMessagesForDistributor = async (req, res) => {
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

export const getDraftedMessagesForDistributor = async (req, res) => {
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

export const getRepliesForDistributor = async (req, res) => {
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

// === PACKAGES ===
export const givePackageToFranchise = async (req, res) => {
    try {
        const { packageId, franchiseId, franchiseShare } = req.body;
        if (!packageId || !franchiseId || !franchiseShare) {

        }
    } catch (error) {

    }
}
