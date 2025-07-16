import jwt from "jsonwebtoken";
import envCredentials from "../config/env.js";
import userModel from "../models/user.model.js";
import adminModel from "../models/admin.model.js";
import franchiseModel from "../models/franchise.model.js";
import distributorModel from "../models/distributor.model.js";

export const userAuth = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.send({ message: "Please Send auth token" })
    }
    const token = req.headers.authorization?.split(' ')[1]


    try {
        const decode = jwt.verify(token, envCredentials.secretKey)
        const user = await userModel.findById(decode.id);
        if (!user) {
            return res.send({ message: "Unauthorized user" });
        }
        req.id = decode.id;
        next()
    } catch (error) {
        return res.send({ status: false, message: "Something went wrong.Check token." })
    }

}

export const franchiseAuth = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.send({ message: "Please Send auth token" })
    }

    const token = req.headers.authorization?.split(' ')[1]

    try {
        const decode = jwt.verify(token, envCredentials.secretKey);
        const franchise = await franchiseModel.findById(decode.id);
        if (!franchise) {
            return res.send({ message: "Unauthorized user" });
        }
        req.id = decode.id;
        next()
    } catch (error) {
        return res.send({ message: "Authorization Error" })
    }

}

export const adminAuth = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.send({ message: "Please Send auth token" })
    }
    const token = req.headers.authorization?.split(' ')[1]


    try {
        const decode = jwt.verify(token, envCredentials.secretKey)
        const admin = await adminModel.findById(decode.id);
        if (!admin) {
            return res.send({ message: "Unauthorized user" });
        }
        req.id = decode.id;
        next()
    } catch (error) {
        return res.send({ message: "Authorization Error" })
    }
}

export const distributorAuth = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.send({ message: "Please Send auth token" })
    }
    const token = req.headers.authorization?.split(' ')[1]


    try {
        const decode = jwt.verify(token, envCredentials.secretKey)
        const distributor = await distributorModel.findById(decode.id);
        if (!distributor) {
            return res.send({ message: "Unauthorized user" });
        }
        req.id = decode.id;
        next()
    } catch (error) {
        return res.send({ message: "Authorization Error" })
    }
}