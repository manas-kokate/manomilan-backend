import jwt from "jsonwebtoken";
import adminModel from "../models/admin.model.js";
import bcrypt from "bcrypt"
import envCredentials from "../config/env.js";
import userModel from "../models/user.model.js";
import locationEntryModel from "../models/location.entry.js";
import stateCountryModel from "../models/state.model.js";
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

//location  
export const getCountry = async (req, res) => {
    try {
        const countries = await countryModel.find({}, '-_id -__v')
        if (countries.length == 0) {
            return res.send({ status: false, message: 'no countries found' })
        }

        return res.send({ status: true, result: countries })
    } catch (error) {
        return res.send({ status: false, message: 'Something went wrong. Server error.' })
    }
}

export const addcountry = async (req, res) => {

    try {
        const { country } = req.body;
        if (!country) {
            return res.send({ status: false, message: "Please send country to add." });
        }

        const newCountry = new countryModel({
            country
        })
        await newCountry.save();
        return res.send({ status: true, message: "New country added" })

    } catch (error) {
        return res.send({ status: false, message: 'Something went wrong. Server error.' })
    }
}

export const getStateCountry = async (req, res) => {
    const { country } = req.body;
    try {
        const StateCountry = await stateCountryModel.find({ country })
        if (StateCountry.length == 0) {
            return res.send({ status: false, message: "No states found for this country" });
        }

        return res.send({ status: true, result: StateCountry });
    }
    catch (error) {
        return res.send({ status: false, message: "Server Error" })
    }
}

export const addStateCountry = async (req, res) => {
    const { state, country } = req.body;
    if (!state || !country) {
        return res.send({ status: false, message: "country and state required" })
    }
    try {
        const newStateCountry = new stateCountryModel({
            state,
            country
        })
        await newStateCountry.save();
        return res.send({ status: true, message: "Added successfully" });

    } catch (error) {
        return res.send({ status: false, message: "Server Error" })
    }
}

export const getlocationEntry = async (req, res) => {
    const { state, country } = req.body;
    if (!state || !country) {
        return res.send({ status: false, message: "state and country required" });
    }
    const stateCountry = {
        state,
        country
    }
    try {
        const locations = await locationEntryModel.find({ stateCountry })
        console.log(locations)
        if (locations.length == 0) {
            return res.send({ status: false, message: "no locations found for this entry" })
        }
        return res.send({ status: true, result: locations })

    } catch (error) {
        return res.send({ status: false, message: "Server error" })
    }
}

export const addlocationEntry = async (req, res) => {

    try {
        const { state, country, city } = req.body;
        if (!state || !country || !city) {
            return res.send({ status: false, message: "state and country required" });
        }
        const stateCountry = {
            state: state,
            country: country
        }

        const existingEntry = await locationEntryModel.findOne({ city: city, stateCountry })
        if (existingEntry) {
            return res.send({ status: false, message: "Entry already exists. Try changing state or country." })
        }

        const newLocationEntry = await locationEntryModel({
            city,
            stateCountry
        })
        await newLocationEntry.save();

        return res.send({ status: true, message: "new location added" })

    } catch (error) {
        return res.send({ status: false, message: "Server error" })
    }
}

// Caste 
