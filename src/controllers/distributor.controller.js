import distributorModel from "../models/distributor.model.js";
import jwt from "jsonwebtoken"
import envCredentials from "../config/env.js";

export const registerDistributor = async (req, res) => {
    const {
        distributorName,
        mobileNumber,
        alternateNumber,
        adharNumber,
        panNumber,
        password,
        email,
        address,
        socialMedia
    } = req.body;

    const ExistingDistributor = await distributorModel.findOne({
        $or: [
            { mobileNumber },
            { adharNumber },
            { panNumber },
            { email }
        ]
    });
    if (ExistingDistributor) {
        return res.send({ status: false, messsage: "Distributor already exists with this details." })
    }

    if (req.files?.qrPhoto || req.files.qrPhoto.length !== 0) {
        const qrPhoto = req.files.qrPhoto[0].filename;
    }

    if (req.files?.distributorPhoto || req.files.distributorPhoto.length !== 0) {
        const distributorPhoto = req.files.distributorPhoto[0].filename
    }

    try {
        const newDistributor = new distributorModel({
            distributorName,
            mobileNumber,
            alternateNumber,
            adharNumber,
            panNumber,
            password,
            email,
            address,
            distributorPhoto,
            qrPhoto,
            socialMedia
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

        // Find distributor by mobile number
        const distributor = await distributorModel.findOne({
            $or: [{ mobileNumber: identifier }, { email: identifier }]
        });

        if (!distributor) {
            return res.status(401).json({ status: false, message: "Invalid mobile number" });
        }

        // Compare passwords
        if (password !== distributor.password) {
            return res.status(401).json({ status: false, message: "Invalid password" });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: distributor._id },
            envCredentials.secretKey,
            { expiresIn: "1h" }
        );

        return res.json({
            status: true,
            message: "Login successful",
            token,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: "Server error" });
    }
};