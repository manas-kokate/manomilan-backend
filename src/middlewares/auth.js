import jwt from "jsonwebtoken";
import envCredentials from "../config/env.js";
import userModel from "../models/user.model.js";


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
        return res.send({ message: "Authorization Error" })
    }

} 