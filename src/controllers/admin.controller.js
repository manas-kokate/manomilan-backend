import jwt from "jsonwebtoken";
import adminModel from "../models/admin.model.js";
import bcrypt from "bcrypt"
import envCredentials from "../config/env.js";
import userModel from "../models/user.model.js";
import expectationsModel from "../models/expectations.model.js";
import locationEntryModel from "../models/location.entry.js";
import stateModel from "../models/state.model.js";
import countryModel from "../models/country.model.js";
import religionModel from "../models/religion.model.js";
import casteModel from "../models/caste.model.js";
import casteEntry from "../models/casteEntry.model.js"



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

//location  
export const getcountries = async (req, res) => {

    try {
        const countries = await countryModel.find({}, { _id: 0, __v: 0 });
        if (countries.length == 0) {
            return res.send({ status: false, message: "No countries found. Contact admin to add." })
        }
        return res.send({ status: true, result: countries })

    } catch (error) {
        return res.send({ status: false, message: "Server error" })
    }
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

    try {
        const States = await stateModel.find({}, { _id: 0, __v: 0 });
        if (States.length == 0) {
            return res.send({ status: false, message: "No States found. Contact admin to add." })
        }
        return res.send({ status: true, result: States })

    } catch (error) {
        return res.send({ status: false, message: "Server error" })
    }
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
    try {
        const locationEntry = await locationEntryModel.find({}, { _id: 0, __v: 0 });
        if (locationEntry.length == 0) {
            return res.send({ status: false, message: "No location found. Contact admin to add." })
        }
        return res.send({ status: true, result: locationEntry })

    } catch (error) {
        return res.send({ status: false, message: "Server error" })
    }
}

export const addLocationEntry = async (req, res) => {

    try {
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

    } catch (error) {
        return res.send({ status: false, message: "Server error" })
    }
}


// Caste 
export const getReligions = async (req, res) => {

    try {
        const findReligions = await religionModel.find()

        if (findReligions.length == 0) {
            return res.send({ status: false, message: "No religion found" });
        }

        return res.send({ status: true, result: findReligions })

    } catch (error) {
        return res.send({ status: false, message: "Server error" })
    }
}

export const addReligion = async (req, res) => {

    try {
        const { religion } = req.body
        if (!religion) {
            return res.send({ status: false, message: "Religion is required" })
        }

        const existingReligion = await religionModel.findOne({ religion });
        if (existingReligion) {
            return res.send({ status: false, message: `${religion} already exists.` })
        }

        const newReligion = new religionModel({
            religion
        })

        await newReligion.save();

        return res.send({ status: true, message: "religion added successfully" })

    } catch (error) {
        return res.send({ status: false, message: "Server error" })
    }
}

export const getCastes = async (req, res) => {
    try {
        const findCastes = await casteModel.find()

        if (findCastes.length == 0) {
            return res.send({ status: false, message: "No castes found" });
        }

        return res.send({ status: true, result: findCastes })

    } catch (error) {
        return res.send({ status: false, message: "Server error" })
    }
}

export const addCastes = async (req, res) => {
    try {
        const { caste } = req.body
        if (!caste) {
            return res.send({ status: false, message: "caste is required" })
        }

        const existingcaste = await casteModel.findOne({ caste });
        if (existingcaste) {
            return res.send({ status: false, message: `${caste} already exists.` })
        }

        const newcaste = new casteModel({
            caste
        })

        await newcaste.save();

        return res.send({ status: true, message: "caste added successfully" })

    } catch (error) {
        return res.send({ status: false, message: "Server error" })
    }
}

export const getCasteEntry = async (req, res) => {
    try {
        const findCasteEntries = await casteModel.find()

        if (findCasteEntries.length == 0) {
            return res.send({ status: false, message: "No caste entry found" });
        }

        return res.send({ status: true, result: findCasteEntries })

    } catch (error) {
        return res.send({ status: false, message: "Server error" })
    }
}

export const addCasteEntry = async (req, res) => {
    try {
        const { casteEntry } = req.body
        if (!casteEntry) {
            return res.send({ status: false, message: "casteEntry is required" })
        }

        const existingcasteEntry = await casteEntryModel.findOne({ casteEntry });
        if (existingcasteEntry) {
            return res.send({ status: false, message: `${casteEntry} already exists.` })
        }

        const newcasteEntry = new casteEntryModel({
            casteEntry
        })

        await newcasteEntry.save();

        return res.send({ status: true, message: "casteEntry added successfully" })

    } catch (error) {
        return res.send({ status: false, message: "Server error" })
    }
}