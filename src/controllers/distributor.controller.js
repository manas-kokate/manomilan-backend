import distributorModel from "../models/distributor.model.js";
import jwt from "jsonwebtoken"
import envCredentials from "../config/env.js";

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
        socialMedia
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
        let distributor = await distributorModel.findOne({ email: identifier });
        if (!distributor) {
            distributor = await distributorModel.findOne({ mobileNumber: identifier })
        }
        if (!distributor) {
            return res.send({ status: false, message: "Distributor not found" })
        }
        console.log(distributor, password)

        if (!distributor) {
            return res.status(401).json({ status: false, message: "Invalid mobile number or email" });
        }

        // Compare passwords
        if (password !== distributor.password) {
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
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: "Server error" });
    }
};
