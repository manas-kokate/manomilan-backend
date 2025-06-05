import jwt from "jsonwebtoken";
import adminModel from "../models/admin.model.js";
import bcrypt from "bcrypt"
import envCredentials from "../config/env.js";
import userModel from "../models/user.model.js";
import expectationsModel from "../models/expectations.model.js";
import locationEntryModel from "../models/location.entry.js";
import stateModel from "../models/state.model.js";
import countryModel from "../models/country.model.js";



export const registerAdmin = async (req, res) => {
    const { email, password } = req.body;
    if (!email) {
        return res.send({ status: false, message: "Email Required!" });
    }
    if (!password) {
        return res.send({ status: false, message: "Password Required!" });
    }

    const ExistingAdmin = await adminModel.findOne({ email });
    if (ExistingAdmin) {
        return res.send({ status: false, message: "Email Already Exists." });
    }

    try {
        const newAdmin = new adminModel({
            email,
            password
        })

        await newAdmin.save()
        return res.send({ status: true, message: "Admin Registered Successfully." });
    } catch (error) {
        return res.send({ status: false, message: "Admin Not Registered.Something went wrong." });
    }

}

export const loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    if (!email) {
        return res.send({ status: false, message: "Email Required!" });
    }
    if (!password) {
        return res.send({ status: false, message: "Password Required!" });
    }

    const ExistingAdmin = await adminModel.findOne({ email });
    if (!ExistingAdmin) {
        return res.send({ status: false, message: "Admin Not Found." });
    }

    if (! await bcrypt.compare(password, ExistingAdmin.password)) {
        return res.send({ status: false, message: "Incorrect password." });
    }

    const token = jwt.sign({ id: ExistingAdmin._id }, envCredentials.secretKey, { expiresIn: '1h' })

    return res.send({ status: true, message: "User Login successful.", token: token });
}

export const getUsers = async (req, res) => {
    const AllUsers = await userModel.find({}, { password: 0, __v: 0 });
    if (!AllUsers) {
        return res.send({ status: false, message: "No user Found." })
    }

    return res.send({ status: true, users: AllUsers });
}

export const updateUserPfp = async (req, res) => {
    const { userId, userStatus } = req.body;
    if (!userId || !userStatus) {
        return res.send({ status: false, message: "User id and status required to update profile pic status." });
    }
    if (!['Approved', 'Rejected'].includes(userStatus)) {
        return res.send({ status: false, message: "Invalid Update Status." });
    }

    const userToUpdate = await userModel.findById({ _id: userId });
    if (!userToUpdate) {
        return res.send({ status: true, message: "User not found." });
    }

    try {

        userToUpdate.profilePicStatus = userStatus;
        await userToUpdate.save()

        return res.send({ status: true, message: "Updated Successfuly" })

    } catch (error) {
        return res.send({ status: false, message: "profile status not updated.Server Error." })
    }
}

export const deleteUser = async (req, res) => {
    const { userId, status } = req.body;
    if (!userId || !status) {
        return res.send({ status: false, message: "Send delete user id." })
    }

    const findDltUser = await userModel.find({ _id: userId });
    if (!findDltUser) {
        return res.send({ status: false, message: "User to delete not found." })
    }

    if (status == 'delete' || status == 'Delete') {
        await expectationsModel.findOneAndDelete({ userId: userId })
        // await userModel.findByIdAndDelete({ _id: userId });
        return res.send({ status: true, message: "User deleted" })
    }
    else {
        return res.send({ status: false, message: "Wrong delete status" })
    }
}

export const getcountries = async (req, res) => {
    const countries = await countryModel.find({}, { _id: 0, __v: 0 });
    if (countries.length == 0) {
        return res.send({ status: false, message: "No countries found. Contact admin to add." })
    }
    return res.send({ status: true, result: countries })
}

export const addcountry = async (req, res) => {
    try {

        const { country } = req.body;
        if (!country) {
            return res.send({ status: false, message: "Please send country to add." })
        }

        const findExistingCountry = await countryModel.findOne({ country });
        if (findExistingCountry) {
            return res.send({ status: false, message: `${country} already exists` })
        }

        const newCountry = new countryModel({
            country
        })
        await newCountry.save();
        return res.send({ status: true, message: `${country} added successfully` })

    } catch (error) {
        return res.send({ status: false, message: "Server error" })
    }
}

export const getStates = async (req, res) => {
    const States = await stateModel.find({}, { _id: 0, __v: 0 });
    if (States.length == 0) {
        return res.send({ status: false, message: "No States found. Contact admin to add." })
    }
    return res.send({ status: true, result: States })
}

export const addState = async (req, res) => {
    try {
        const { state } = req.body;
        if (!state) {
            return res.send({ status: false, message: "Please send state to add." })
        }

        const findExistingstate = await stateModel.findOne({ state });
        if (findExistingstate) {
            return res.send({ status: false, message: `${state} already exists` })
        }

        const newState = new stateModel({
            state
        })
        await newState.save();
        return res.send({ status: true, message: `${state} added successfully` })
    } catch (error) {
        return res.send({ status: false, message: "Server error" })
    }
}

export const getLocationEntry = async (req, res) => {
    const locationEntry = await locationEntryModel.find({}, { _id: 0, __v: 0 });
    if (locationEntry.length == 0) {
        return res.send({ status: false, message: "No location found. Contact admin to add." })
    }
    return res.send({ status: true, result: locationEntry })
}

export const addLocationEntry = async (req, res) => {
    const { country, state, city } = req.body;

    if (!country || !state || !city) {
        return res.send({ status: false, message: "Please send all fields." })
    }

    const existingEntry = await locationEntryModel.findOne({ city });
    if (existingEntry) {
        return res.send({ status: false, message: `${city},${state},${country} already exists.` })
    }

    const newEntry = new locationEntryModel({
        city,
        state,
        country
    })

    await newEntry.save()
    return res.send({ status: false, message: `${newEntry.city},${newEntry.state},${newEntry.country} added successfully` })
}
