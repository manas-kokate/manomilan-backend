import jwt from "jsonwebtoken";
import adminModel from "../models/admin.model.js";
import bcrypt from "bcrypt"
import envCredentials from "../config/env.js";
import userModel from "../models/user.model.js";
import locationEntryModel from "../models/small_models/location.entry.js";
import stateCountryModel from "../models/small_models/state.model.js";
import countryModel from "../models/small_models/country.model.js";
import casteModel from "../models/small_models/caste.model.js";
import religionModel from "../models/small_models/religion.model.js";
import subcasteModel from "../models/small_models/subcaste.model.js";
import streamModel from "../models/small_models/stream.model.js";
import degreeModel from "../models/small_models/degree.model.js";
import foodPrefModel from "../models/small_models/foodPref.model.js";
import bodyTypeModel from "../models/small_models/bodyTypeModel.js";
import complexionModel from "../models/small_models/complexionModel.js";
import familyBgModel from "../models/small_models/familyBgModel.js";
import sectModel from "../models/small_models/sect.model.js";
import positionsModel from "../models/small_models/positionsModel.js";
import manglikModel from "../models/small_models/manglikModel.js";
import motherTongueModel from "../models/small_models/motherTongue.js";
import distributorModel from "../models/distributor.model.js";
import freepackageModel from "../models/small_models/freepackage.model.js";
import franchiseModel from "../models/franchise.model.js";
import distributorpointslogModel from "../models/small_models/distributorpointslog.model.js";
import vipPackageModel from "../models/small_models/vipPackage.model.js";
import mainPackageModel from "../models/small_models/mainPackage.model.js";
import addOnPackageModel from "../models/small_models/addOnPackage.model.js";
import MessageModel from "../models/small_models/message.model.js";
import adminPointsLogModel from "../models/small_models/adminPointsLog.model.js";


export const registerAdmin = async (req, res) => {
    const { name, email, password, transactionPassword, givePointsPassword } = req.body;
    if (!email) {
        return res.send({ status: false, message: "Email Required!" });
    }
    if (!password) {
        return res.send({ status: false, message: "Password Required!" });
    }

    if (!name) {
        return res.send({ status: false, message: "Name Required!" });
    }
    if (!givePointsPassword) {
        return res.send({ status: false, message: "givePointsPassword Required!" });
    }

    if (!transactionPassword) {
        return res.send({ status: false, message: "TransactionPassword Required!" });
    }

    const ExistingAdmin = await adminModel.findOne({ email });
    if (ExistingAdmin) {
        return res.send({ status: false, message: "Email Already Exists." });
    }

    try {
        const newAdmin = new adminModel({
            email,
            password,
            transactionPassword,
            name,
            givePointsPassword
        })

        await newAdmin.save()
        return res.send({ status: true, message: "Admin Registered Successfully." });
    } catch (error) {
        return res.send({ status: false, message: "Admin Not Registered.Something went wrong." });
    }

}

export const loginAdmin = async (req, res) => {
    const { identifier, password } = req.body;
    if (!identifier) {
        return res.send({ status: false, message: "identifier Required!" });
    }
    if (!password) {
        return res.send({ status: false, message: "Password Required!" });
    }

    const ExistingAdmin = await adminModel.findOne({ email: identifier });
    if (!ExistingAdmin) {
        return res.send({ status: false, message: "Admin Not Found." });
    }

    if (! await bcrypt.compare(password, ExistingAdmin.password)) {
        return res.send({ status: false, message: "Incorrect password." });
    }

    const token = jwt.sign({ id: ExistingAdmin._id }, envCredentials.secretKey, { expiresIn: '4h' })

    return res.send({ status: true, message: "User Login successful.", token: token, ExistingAdmin });
}

export const getCurrentAdmin = async (req, res) => {
    try {
        const adminId = req.id;
        const admin = await adminModel.findById(adminId);
        return res.send({ status: true, admin })
    } catch (error) {
        return res.send({ status: false, message: "Server error" })
    }
}

export const getUsers = async (req, res) => {
    try {
        const lowerLimit = parseInt(req.query.lowerLimit) || 0;
        const upperLimit = parseInt(req.query.upperLimit) || 20;
        const AllUsers = await userModel.find().skip(lowerLimit).limit(upperLimit);
        if (AllUsers.length == 0) {
            return res.send({ status: false, message: "No users Found." })
        }

        return res.send({ status: true, users: AllUsers });
    } catch (error) {
        return res.send({ status: false, message: "Something went wrong. Internal server error" })
    }
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

// ==== COUNTRY ====  
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

        const existingCountry = await countryModel.findOne({ country });
        if (existingCountry) {
            return res.send({ status: false, message: "Country already exists" })
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

export const deleteCountry = async (req, res) => {
    try {
        const { country } = req.body;
        if (!country) {
            return res.send({ status: false, message: "Please send country to delete." });
        }
        const deletedCountry = await countryModel.findOneAndDelete({ country });
        await stateCountryModel.deleteMany({ country });
        await locationEntryModel.deleteMany({
            'stateCountry.country': country
        }, { status: 'inactive' })

        if (!deletedCountry) {
            return res.send({ status: false, message: "Country not found." });
        }
        return res.send({ status: true, message: "Country deleted successfully." });
    } catch (error) {
        return res.send({ status: false, message: 'Something went wrong. Server error.' });
    }
};

export const updateCountry = async (req, res) => {
    try {
        const { oldCountry, newCountry } = req.body;
        if (!oldCountry || !newCountry) {
            return res.send({ status: false, message: "Please send oldCountry and newCountry to update." });
        }

        const updatedCountry = await countryModel.findOneAndUpdate(
            { country: oldCountry },
            { country: newCountry }
        );

        await stateCountryModel.updateMany(
            { country: oldCountry },
            { country: newCountry }
        );

        await locationEntryModel.updateMany(
            { "stateCountry.country": oldCountry },
            { "stateCountry.country": newCountry }
        );

        if (!updatedCountry) {
            return res.send({ status: false, message: "Country not found." });
        }

        return res.send({ status: true, message: "Country updated successfully." });
    } catch (error) {
        return res.send({ status: false, message: 'Something went wrong. Server error.' });
    }
};


//=== STATE ===

export const getStateCountry = async (req, res) => {
    try {
        const { country } = req.query;
        if (!country) {
            return res.send({ status: false, message: "Please send params" })
        }
        const StateCountry = await stateCountryModel.find({ country }, '-_id -__v')
        if (StateCountry.length == 0) {
            return res.send({ status: false, message: "No states found for this country" });
        }
        return res.send({ status: true, result: StateCountry });
    }
    catch (error) {
        return res.send({ status: false, message: "Server Error" })
    }
}

export const getAllStates = async (req, res) => {
    try {
        const allStates = await stateCountryModel.find({}, '-_id -__v');
        if (allStates.length == 0) {
            return res.send({ status: false, message: "No states found" })
        }

        return res.send({ status: true, allStates: allStates })
    } catch (error) {
        return res.send({ status: false, message: "Server Error" })
    }
}

export const addStateCountry = async (req, res) => {
    try {
        const { state, country } = req.body;
        if (!state || !country) {
            return res.send({ status: false, message: "country and state required" })
        }
        const existingState = await stateCountryModel.findOne({ state, country });
        if (existingState) {
            return res.send({ status: false, message: "This state and country already exists" })
        }
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

export const deleteStateCountry = async (req, res) => {
    try {
        const { state, country } = req.body;

        if (!state || !country) {
            return res.send({ status: false, message: "Both state and country are required." });
        }

        // Delete the state-country entry
        const deletedEntry = await stateCountryModel.findOneAndDelete({ state, country });

        if (!deletedEntry) {
            return res.send({ status: false, message: "No matching state and country found." });
        }

        // Delete related location entries
        await locationEntryModel.deleteMany({
            "stateCountry.state": state,
            "stateCountry.country": country
        });

        return res.send({ status: true, message: "State, country, and related locations deleted successfully." });

    } catch (error) {
        console.error("Error deleting state-country:", error);
        return res.send({ status: false, message: "Server error while deleting state and country." });
    }
};

export const updateState = async (req, res) => {
    try {
        const { country, oldState, newState } = req.body;
        if (!country || !oldState || !newState) {
            return res.send({ status: false, message: "Please send country, oldState, and newState to update." });
        }

        const updatedState = await stateCountryModel.findOneAndUpdate(
            { country, state: oldState },
            { state: newState }
        );

        await locationEntryModel.updateMany(
            {
                "stateCountry.country": country,
                "stateCountry.state": oldState
            },
            { "stateCountry.state": newState }
        );

        if (!updatedState) {
            return res.send({ status: false, message: "State not found." });
        }

        return res.send({ status: true, message: "State updated successfully." });
    } catch (error) {
        return res.send({ status: false, message: 'Something went wrong. Server error.' });
    }
};


// === CITY ===

export const getAllLocations = async (req, res) => {
    try {
        const allLocations = await locationEntryModel.find({}, '-_id -__v');
        if (allLocations.length == 0) {
            return res.send({ status: false, message: "No Locations found" })
        }

        return res.send({ status: true, allLocations: allLocations })
    } catch (error) {
        return res.send({ status: false, message: "Server Error" })
    }
}

export const getlocationEntry = async (req, res) => {
    try {
        const { state, country } = req.query;
        if (!state || !country) {
            return res.send({ status: false, message: "state and country required in params" });
        }
        const stateCountry = {
            state,
            country
        }
        const locations = await locationEntryModel.find({ stateCountry }, '-_id -__v')
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

export const deleteCity = async (req, res) => {

    try {
        const { country, state, city } = req.body;
        const stateCountry = {
            state,
            country
        }
        if (!country || !state || !city) {
            return res.send({ status: false, message: "state,country and city required" })
        }

        const deletedCity = await locationEntryModel.findOneAndDelete({
            city,
            stateCountry
        })
        if (!deletedCity) {
            return res.send({ status: false, message: "city not found" });
        }

        return res.send({ status: true, message: "Deleted successfully" })

    } catch (error) {
        return res.send({ status: false, message: "server Error" })
    }
}

export const updateCity = async (req, res) => {
    try {
        const { country, state, oldCity, newCity } = req.body;
        if (!country || !state || !oldCity || !newCity) {
            return res.send({ status: false, message: "Please send country, state, oldCity, and newCity to update." });
        }

        const updatedCity = await locationEntryModel.findOneAndUpdate(
            {
                "stateCountry.country": country,
                "stateCountry.state": state,
                city: oldCity
            },
            { city: newCity }
        );

        if (!updatedCity) {
            return res.send({ status: false, message: "City not found." });
        }

        return res.send({ status: true, message: "City updated successfully." });
    } catch (error) {
        return res.send({ status: false, message: 'Something went wrong. Server error.' });
    }
};


// === RELIGION ===
export const getReligion = async (req, res) => {
    try {
        const religions = await religionModel.find({}, '-_id -__v');
        if (religions.length === 0) {
            return res.send({ status: false, message: 'No religions found' });
        }
        return res.send({ status: true, result: religions });
    } catch (error) {
        return res.send({ status: false, message: 'Something went wrong. Server error.' });
    }
};

export const addReligion = async (req, res) => {
    try {
        let { religion } = req.body;
        if (!religion) {
            return res.send({ status: false, message: "Please send religion to add." });
        }

        const exists = await religionModel.findOne({ religion });
        if (exists) {
            return res.send({ status: false, message: "Religion already exists." });
        }

        const newReligion = new religionModel({ religion });
        await newReligion.save();
        return res.send({ status: true, message: "New religion added" });

    } catch (error) {
        return res.send({ status: false, message: 'Something went wrong. Server error.' });
    }
};

export const updateReligion = async (req, res) => {
    try {
        const { oldReligion, newReligion } = req.body;
        if (!oldReligion || !newReligion) {
            return res.send({ status: false, message: "Please send oldReligion and newReligion to update." });
        }

        const updatedReligion = await religionModel.findOneAndUpdate(
            { religion: oldReligion },
            { religion: newReligion }
        );

        await casteModel.updateMany(
            { religion: oldReligion },
            { religion: newReligion }
        );

        await subcasteModel.updateMany(
            { "casteReligion.religion": oldReligion },
            { "casteReligion.religion": newReligion }
        );

        if (!updatedReligion) {
            return res.send({ status: false, message: "Religion not found." });
        }

        return res.send({ status: true, message: "Religion updated successfully." });
    } catch (error) {
        return res.send({ status: false, message: 'Something went wrong. Server error.' });
    }
};

export const deleteReligion = async (req, res) => {
    try {
        const { religion } = req.body;
        if (!religion) {
            return res.send({ status: false, message: "Please send religion to delete." });
        }

        const deletedReligion = await religionModel.findOneAndDelete({ religion });
        await casteModel.deleteMany({ religion });
        await subcasteModel.deleteMany({ "casteReligion.religion": religion });

        if (!deletedReligion) {
            return res.send({ status: false, message: "Religion not found." });
        }

        return res.send({ status: true, message: "Religion deleted successfully." });
    } catch (error) {
        return res.send({ status: false, message: 'Something went wrong. Server error.' });
    }
};

// === CASTE ===
export const getAllCastes = async (req, res) => {
    try {
        const allCastes = await casteModel.find({}, '-_id -__v');
        if (allCastes.length === 0) {
            return res.send({ status: false, message: "No castes found" });
        }
        return res.send({ status: true, result: allCastes });
    } catch (error) {
        return res.send({ status: false, message: "Server Error" });
    }
};

export const getCasteByReligion = async (req, res) => {
    try {
        const { religion } = req.query;
        const castes = await casteModel.find({ religion });
        if (castes.length === 0) {
            return res.send({ status: false, message: "No castes found for this religion" });
        }
        return res.send({ status: true, result: castes });
    } catch (error) {
        return res.send({ status: false, message: "Server Error" });
    }
};

export const addCasteReligion = async (req, res) => {
    try {
        const { caste, religion } = req.body;
        if (!caste || !religion) {
            return res.send({ status: false, message: "Religion and caste required" });
        }
        const exists = await casteModel.findOne({ caste, religion });
        if (exists) {
            return res.send({ status: false, message: "Caste already exists under this religion." });
        }

        const newCaste = new casteModel({ caste, religion });
        await newCaste.save();
        return res.send({ status: true, message: "Added successfully" });
    } catch (error) {
        return res.send({ status: false, message: "Server Error" });
    }
};

export const updateCaste = async (req, res) => {
    try {
        const { religion, oldCaste, newCaste } = req.body;
        if (!religion || !oldCaste || !newCaste) {
            return res.send({ status: false, message: "Please send religion, oldCaste, and newCaste to update." });
        }

        const updatedCaste = await casteModel.findOneAndUpdate(
            { religion, caste: oldCaste },
            { caste: newCaste }
        );

        await subcasteModel.updateMany(
            {
                "casteReligion.religion": religion,
                "casteReligion.caste": oldCaste
            },
            { "casteReligion.caste": newCaste }
        );

        if (!updatedCaste) {
            return res.send({ status: false, message: "Caste not found." });
        }

        return res.send({ status: true, message: "Caste updated successfully." });
    } catch (error) {
        return res.send({ status: false, message: 'Something went wrong. Server error.' });
    }
};

export const deleteCaste = async (req, res) => {
    try {
        const { religion, caste } = req.body;
        if (!religion || !caste) {
            return res.send({ status: false, message: "Please send religion and caste to delete." });
        }

        const deletedCaste = await casteModel.findOneAndDelete({ religion, caste });
        await subcasteModel.deleteMany({ "casteReligion.religion": religion, "casteReligion.caste": caste });

        if (!deletedCaste) {
            return res.send({ status: false, message: "Caste not found." });
        }

        return res.send({ status: true, message: "Caste deleted successfully." });
    } catch (error) {
        return res.send({ status: false, message: 'Something went wrong. Server error.' });
    }
};

//=== SUBCASTE ===
export const getAllSubCastes = async (req, res) => {
    try {
        const allSubCastes = await subcasteModel.find({}, '-_id -__v');
        if (allSubCastes.length === 0) {
            return res.send({ status: false, message: "No subcastes found" });
        }
        return res.send({ status: true, result: allSubCastes });
    } catch (error) {
        return res.send({ status: false, message: "Server Error" });
    }
};

export const getSubCasteEntry = async (req, res) => {

    try {
        const { caste, religion } = req.query;
        if (!caste || !religion) {
            return res.send({ status: false, message: "Caste and religion required" });
        }

        const casteReligion = { caste, religion };
        const subCastes = await subcasteModel.find({ casteReligion });
        if (subCastes.length === 0) {
            return res.send({ status: false, message: "No subcastes found for this entry" });
        }
        return res.send({ status: true, result: subCastes });
    } catch (error) {
        return res.send({ status: false, message: "Server error" });
    }
};

export const addSubCasteEntry = async (req, res) => {
    try {
        const { caste, religion, subCaste } = req.body;
        if (!caste || !religion || !subCaste) {
            return res.send({ status: false, message: "Caste, religion, and subcaste required" });
        }

        const casteReligion = { caste, religion };

        const existingEntry = await subcasteModel.findOne({ subCaste, casteReligion });
        if (existingEntry) {
            return res.send({ status: false, message: "Subcaste already exists under this caste and religion." });
        }

        const newSubCasteEntry = new subcasteModel({
            subCaste,
            casteReligion
        });

        await newSubCasteEntry.save();
        return res.send({ status: true, message: "New subcaste added" });

    } catch (error) {
        return res.send({ status: false, message: "Server error" });
    }
};

export const updateSubCaste = async (req, res) => {
    try {
        const { religion, caste, oldSubCaste, newSubCaste } = req.body;
        if (!religion || !caste || !oldSubCaste || !newSubCaste) {
            return res.send({ status: false, message: "Please send religion, caste, oldSubCaste, and newSubCaste to update." });
        }

        const updatedSubCaste = await subcasteModel.findOneAndUpdate(
            {
                subCaste: oldSubCaste,
                casteReligion: { religion, caste }
            },
            { subCaste: newSubCaste }
        );

        if (!updatedSubCaste) {
            return res.send({ status: false, message: "Subcaste not found." });
        }

        return res.send({ status: true, message: "Subcaste updated successfully." });
    } catch (error) {
        return res.send({ status: false, message: 'Something went wrong. Server error.' });
    }
};

export const deleteSubCaste = async (req, res) => {
    try {
        const { religion, caste, subCaste } = req.body;
        if (!religion || !caste || !subCaste) {
            return res.send({ status: false, message: "Please send religion, caste, and subcaste to delete." });
        }

        const deletedSubCaste = await subcasteModel.findOneAndDelete({
            subCaste,
            casteReligion: { religion, caste }
        });

        if (!deletedSubCaste) {
            return res.send({ status: false, message: "Subcaste not found." });
        }

        return res.send({ status: true, message: "Subcaste deleted successfully." });
    } catch (error) {
        return res.send({ status: false, message: 'Something went wrong. Server error.' });
    }
};


// === EDUCATION == 

// === DEGREE ===

export const getAllDegrees = async (req, res) => {
    try {
        const degrees = await degreeModel.find({});
        return res.send({ status: true, data: degrees });
    } catch (error) {
        return res.send({ status: false, message: "Server Error" });
    }
};

export const getDegreesByStream = async (req, res) => {
    try {
        const { stream } = req.query;
        if (!stream) {
            return res.send({ status: false, message: "stream is required" });
        }

        const degrees = await degreeModel.find({ stream });
        return res.send({ status: true, data: degrees });
    } catch (error) {
        return res.send({ status: false, message: "Server Error" });
    }
};

export const addDegree = async (req, res) => {
    try {
        const { stream, degree } = req.body;
        if (!degree || !stream) {
            return res.send({ status: false, message: "degree and stream are required" });
        }
        const existingDegree = await degreeModel.findOne({
            degree,
            stream
        });
        if (existingDegree) {
            return res.send({ status: false, message: "degree already exists" })
        }

        const newDegree = new degreeModel({
            degree,
            stream
        })
        await newDegree.save();
        return res.send({ status: true, message: "degree added successfully" })
    } catch (error) {
        return res.send({ status: false, message: "Server Error" })
    }
}

export const deleteDegree = async (req, res) => {
    try {
        const { stream, degree } = req.body;
        if (!stream || !degree) {
            return res.send({ status: false, message: "stream and degree are required" });
        }

        const deleted = await degreeModel.deleteOne({ stream, degree });

        if (deleted.deletedCount === 0) {
            return res.send({ status: false, message: "Degree not found" });
        }

        return res.send({ status: true, message: "Degree deleted successfully" });
    } catch (error) {
        return res.send({ status: false, message: "Server Error" });
    }
};

//=== STREAMS ===

export const getAllStreams = async (req, res) => {
    try {
        const streams = await streamModel.find({});
        return res.send({ status: true, data: streams });
    } catch (error) {
        return res.send({ status: false, message: "Server Error" });
    }
};

export const addStream = async (req, res) => {
    try {
        const { stream } = req.body;
        if (!stream) {
            return res.send({ status: false, message: " stream is required" });
        }
        const existingStream = await streamModel.findOne({ stream });
        if (existingStream) {
            return res.send({ status: false, message: "stream already exists" })
        }

        const newStream = new streamModel({
            stream
        })
        await newStream.save();
        return res.send({ status: true, message: "stream added successfully" })

    } catch (error) {
        return res.send({ status: false, message: "Server Error" })
    }
}

export const deleteStream = async (req, res) => {
    try {
        const { stream } = req.body;
        if (!stream) {
            return res.send({ status: false, message: "stream is required" });
        }

        const existingStream = await streamModel.findOne({ stream });
        if (!existingStream) {
            return res.send({ status: false, message: "stream not found" });
        }

        // Delete all degrees under this stream
        await degreeModel.deleteMany({ stream });

        // Delete the stream itself
        await streamModel.deleteOne({ stream });

        return res.send({ status: true, message: "stream and its degrees deleted successfully" });
    } catch (error) {
        return res.send({ status: false, message: "Server Error" });
    }
};

// === FOOD CHOICE ===
export const addFoodPref = async (req, res) => {
    try {
        const { foodPreference } = req.body;

        if (!foodPreference) {
            return res.send({ status: false, message: "food preference required" })
        }

        const existingFoodPref = await foodPrefModel.findOne({ foodPreference });
        if (existingFoodPref) {
            return res.send({ status: false, message: "Food preference already exists" })
        }

        const newFoodPref = new foodPrefModel({
            foodPreference
        })

        await newFoodPref.save()

        return res.send({ status: true, message: "New food Preference added" })

    } catch (error) {
        return res.send({ status: false, message: "Server error" })
    }
}

export const getFoodPref = async (req, res) => {
    try {

        const findFoodChoices = await foodPrefModel.find({}, '-_id -__v')
        return res.send({ status: false, result: findFoodChoices });

    } catch (error) {
        return res.send({ status: false, result: "Something went wrong. Server Error." });
    }
}

export const deleteFoodPref = async (req, res) => {
    try {
        const { foodPref } = req.body;
        if (!foodPref) {
            return res.send({ status: false, result: "delete food choice required." });
        }
        await foodPrefModel.findOneAndDelete({ foodPreference: foodPref })
        return res.send({ status: true, message: "Deleted successfully" })
    } catch (error) {
        return res.send({ status: false, result: "Something went wrong. Server Error." });
    }
}

// === BODY TYPE ===
export const addBodyType = async (req, res) => {
    try {
        const { bodyType } = req.body;
        if (!bodyType) {
            return res.send({ status: false, message: "bodyType is required" });
        }

        const exists = await bodyTypeModel.findOne({ bodyType });
        if (exists) {
            return res.send({ status: false, message: "Body Type already exists" });
        }

        const newData = new bodyTypeModel({ bodyType });
        await newData.save();
        return res.send({ status: true, message: "Body Type added successfully" });
    } catch (error) {
        return res.send({ status: false, message: "Server error" });
    }
};

export const getBodyTypes = async (req, res) => {
    try {
        const data = await bodyTypeModel.find({}, '-__v -_id');
        return res.send({ status: true, result: data });
    } catch (error) {
        return res.send({ status: false, message: "Server error" });
    }
};

export const deleteBodyType = async (req, res) => {
    try {
        const { bodyType } = req.body;
        if (!bodyType) {
            return res.send({ status: false, message: "bodyType is required for deletion" });
        }
        await bodyTypeModel.findOneAndDelete({ bodyType });
        return res.send({ status: true, message: "Deleted successfully" });
    } catch (error) {
        return res.send({ status: false, message: "Server error" });
    }
};

// === COMPLEXION MODEL ===
export const addComplexion = async (req, res) => {
    try {
        const { complexion } = req.body;
        if (!complexion) {
            return res.send({ status: false, message: "complexion is required" });
        }

        const exists = await complexionModel.findOne({ complexion });
        if (exists) {
            return res.send({ status: false, message: "Complexion already exists" });
        }

        const newData = new complexionModel({ complexion });
        await newData.save();
        return res.send({ status: true, message: "Complexion added successfully" });
    } catch (error) {
        return res.send({ status: false, message: "Server error" });
    }
};

export const getComplexions = async (req, res) => {
    try {
        const data = await complexionModel.find({}, '-__v -_id');
        return res.send({ status: true, result: data });
    } catch (error) {
        return res.send({ status: false, message: "Server error" });
    }
};

export const deleteComplexion = async (req, res) => {
    try {
        const { complexion } = req.body;
        if (!complexion) {
            return res.send({ status: false, message: "complexion is required for deletion" });
        }
        await complexionModel.findOneAndDelete({ complexion });
        return res.send({ status: true, message: "Deleted successfully" });
    } catch (error) {
        return res.send({ status: false, message: "Server error" });
    }
};


// === FAMILY BG ===
export const addFamilyBg = async (req, res) => {
    try {
        const { familyBg } = req.body;
        if (!familyBg) {
            return res.send({ status: false, message: "familyBg is required" });
        }

        const exists = await familyBgModel.findOne({ familyBg });
        if (exists) {
            return res.send({ status: false, message: "Family Background already exists" });
        }

        const newData = new familyBgModel({ familyBg });
        await newData.save();
        return res.send({ status: true, message: "Family Background added successfully" });
    } catch (error) {
        return res.send({ status: false, message: "Server error" });
    }
};

export const getFamilyBgs = async (req, res) => {
    try {
        const data = await familyBgModel.find({}, '-__v -_id');
        return res.send({ status: true, result: data });
    } catch (error) {
        return res.send({ status: false, message: "Server error" });
    }
};

export const deleteFamilyBg = async (req, res) => {
    try {
        const { familyBg } = req.body;
        if (!familyBg) {
            return res.send({ status: false, message: "familyBg is required for deletion" });
        }
        await familyBgModel.findOneAndDelete({ familyBg });
        return res.send({ status: true, message: "Deleted successfully" });
    } catch (error) {
        return res.send({ status: false, message: "Server error" });
    }
};

// === SECT === 
export const addSect = async (req, res) => {
    try {
        const { sect } = req.body;
        if (!sect) {
            return res.send({ status: false, message: "sect is required" });
        }

        const exists = await sectModel.findOne({ sect });
        if (exists) {
            return res.send({ status: false, message: "Sect already exists" });
        }

        const newData = new sectModel({ sect });
        await newData.save();
        return res.send({ status: true, message: "Sect added successfully" });
    } catch (error) {
        return res.send({ status: false, message: "Server error" });
    }
};

export const getSects = async (req, res) => {
    try {
        const data = await sectModel.find({}, '-__v -_id');
        return res.send({ status: true, result: data });
    } catch (error) {
        return res.send({ status: false, message: "Server error" });
    }
};

export const deleteSect = async (req, res) => {
    try {
        const { sect } = req.body;
        if (!sect) {
            return res.send({ status: false, message: "sect is required for deletion" });
        }
        await sectModel.findOneAndDelete({ sect });
        return res.send({ status: true, message: "Deleted successfully" });
    } catch (error) {
        return res.send({ status: false, message: "Server error" });
    }
};


// === POSITION === 
export const addPosition = async (req, res) => {
    try {
        const { position } = req.body;
        if (!position) {
            return res.send({ status: false, message: "position is required" });
        }

        const exists = await positionsModel.findOne({ position });
        if (exists) {
            return res.send({ status: false, message: "Position already exists" });
        }

        const newData = new positionsModel({ position });
        await newData.save();
        return res.send({ status: true, message: "Position added successfully" });
    } catch (error) {
        return res.send({ status: false, message: "Server error" });
    }
};

export const getPositions = async (req, res) => {
    try {
        const data = await positionsModel.find({}, '-__v -_id');
        return res.send({ status: true, result: data });
    } catch (error) {
        return res.send({ status: false, message: "Server error" });
    }
};

export const deletePosition = async (req, res) => {
    try {
        const { position } = req.body;
        if (!position) {
            return res.send({ status: false, message: "position is required for deletion" });
        }
        await positionsModel.findOneAndDelete({ position });
        return res.send({ status: true, message: "Deleted successfully" });
    } catch (error) {
        return res.send({ status: false, message: "Server error" });
    }
};


// === MANGLIK MODEL ===
export const addManglik = async (req, res) => {
    try {
        const { manglik } = req.body;
        if (!manglik) {
            return res.send({ status: false, message: "manglik value is required" });
        }

        const exists = await manglikModel.findOne({ manglik });
        if (exists) {
            return res.send({ status: false, message: "Manglik already exists" });
        }

        const newData = new manglikModel({ manglik });
        await newData.save();
        return res.send({ status: true, message: "Manglik option added successfully" });
    } catch (error) {
        return res.send({ status: false, message: "Server error" });
    }
};

export const getMangliks = async (req, res) => {
    try {
        const data = await manglikModel.find({}, '-__v -_id');
        return res.send({ status: true, result: data });
    } catch (error) {
        return res.send({ status: false, message: "Server error" });
    }
};

export const deleteManglik = async (req, res) => {
    try {
        const { manglik } = req.body;
        if (!manglik) {
            return res.send({ status: false, message: "manglik is required for deletion" });
        }
        await manglikModel.findOneAndDelete({ manglik });
        return res.send({ status: true, message: "Deleted successfully" });
    } catch (error) {
        return res.send({ status: false, message: "Server error" });
    }
};

// === MOTHER TONGUE ===
export const getMotherTongue = async (req, res) => {
    try {
        const motherTongues = await motherTongueModel.find({}, '-_id -__v');
        if (motherTongues.length == 0) {
            return res.send({ status: false, message: "No mother tongues found" });
        }
        return res.send({ status: true, result: motherTongues });
    } catch (error) {
        return res.send({ status: false, message: "Server Error" });
    }
};

export const addMotherTongue = async (req, res) => {
    try {
        const { motherTongue } = req.body;
        if (!motherTongue) {
            return res.send({ status: false, message: "Mother tongue is required" });
        }
        const existingMotherTongue = await motherTongueModel.findOne({ motherTongue });
        if (existingMotherTongue) {
            return res.send({ status: false, message: "Mother tongue already exists" });
        }
        const newMotherTongue = new motherTongueModel({ motherTongue });
        await newMotherTongue.save();
        return res.send({ status: true, message: "Mother tongue added successfully" });
    } catch (error) {
        return res.send({ status: false, message: "Server Error" });
    }
};

export const deleteMotherTongue = async (req, res) => {
    try {
        const { motherTongue } = req.body;
        if (!motherTongue) {
            return res.send({ status: false, message: "Mother tongue is required" });
        }
        const deletedMotherTongue = await motherTongueModel.findOneAndDelete({ motherTongue });
        if (!deletedMotherTongue) {
            return res.send({ status: false, message: "Mother tongue not found" });
        }
        return res.send({ status: true, message: "Mother tongue deleted successfully" });
    } catch (error) {
        return res.send({ status: false, message: "Server Error" });
    }
};

export const getDistributors = async (req, res) => {
    try {
        const distributors = await distributorModel.find();
        if (!distributors) {
            return res.send({ status: false, message: "No distributors found." })
        }
        return res.send({ status: true, result: distributors })
    } catch ({ error }) {
        return res.send({ status: false, message: "Something went wrong. Server error." })
    }
}

export const getSingleFranchise = async (req, res) => {
    try {
        const franchiseId = req.params.id;
        if (!franchiseId) {
            return res.send({ status: false, message: "Please send franchise Id in params" });
        }

        const singleFranchise = await franchiseModel.findById(franchiseId);
        if (!singleFranchise) {
            return res.send({ status: false, message: "franchise not found" });
        }
        return res.send({ status: true, singleFranchise: singleFranchise });

    } catch (error) {
        return res.send({ status: false, message: "Server error" });
    }
}

export const getSingleDistributor = async (req, res) => {
    try {
        const distributorId = req.params.id;
        if (!distributorId) {
            return res.send({ status: false, message: "Please send distributor Id in params" });
        }

        const singleDistributor = await distributorModel.findById(distributorId);
        if (!singleDistributor) {
            return res.send({ status: false, message: "Distributor not found" });
        }
        return res.send({ status: true, singleDistributor: singleDistributor });

    } catch (error) {
        return res.send({ status: false, message: "Server error" });
    }
}

export const getFranchiseUnder = async (req, res) => {
    try {
        const distributorId = req.params.id;
        const distributor = await distributorModel.findById(distributorId);
        const franchiseUnder = await franchiseModel.find({ distributorUnder: distributor.distributorName })
        return res.send({ status: true, franchiseUnder })
    } catch (error) {
        return res.send({ status: false, message: "Server error" })
    }
}

// === POINTS ====
export const addNewPoints = async (req, res) => {
    try {
        const adminId = req.id;
        const { points, transactionPassword } = req.body;

        if (!points || !transactionPassword) {
            return res.send({ status: false, message: "Points and transactionPassword required" })
        }

        const admin = await adminModel.findById(adminId);
        if (!(await bcrypt.compare(transactionPassword, admin.transactionPassword))) {
            return res.send({ status: false, message: 'Invalid transaction password' })
        }

        admin.points = parseInt(admin.points) + parseInt(points);
        const newAdminLog = new adminPointsLogModel({
            adminId: admin._id,
            points: points,
            Type: 'Credited',
            Balance: admin.points
        })

        try {
            await admin.save();
            await newAdminLog.save()
            return res.send({ status: true, message: 'New points added successfully and updated admin points log.' })
        } catch (error) {
            return res.send({ status: false, message: "Points not updated.Something went wrong." })
        }
    } catch (error) {
        return res.send({ status: false, message: "Server Error" })
    }

}

export const getPoints = async (req, res) => {
    try {
        const adminId = req.id;
        const allPointsEntries = await adminPointsLogModel.find().sort({ createdAt: -1 })
        if (allPointsEntries.length === 0) {
            return res.send({ status: false, message: "No points entries found for this admin" })
        }

        return res.send({ status: true, entries: allPointsEntries })

    } catch (error) {
        return res.send({ status: false, message: "Server error" })
    }
}

export const givePointsToDistributor = async (req, res) => {
    try {
        const adminId = req.id
        const { distributorId, points, givePointsPassword } = req.body;
        if (!distributorId || !points || !givePointsPassword) {
            return res.send({ status: false, message: "Distributor id and points required" })
        }

        const distributor = await distributorModel.findById(distributorId);
        const admin = await adminModel.findById(adminId);

        if (parseInt(admin.points) < parseInt(points)) {
            return res.send({ status: false, message: "You have Insufficient points. Please add more points to allot." })
        }

        if (parseInt(points) == 0) {
            return res.send({ status: false, message: 'Points undefined or 0 please check before sending.' })
        }
        if (!(await bcrypt.compare(givePointsPassword, admin.givePointsPassword))) {
            return res.send({ status: false, message: 'Invalid password. Points not alloted' })
        }

        distributor.points = parseInt(distributor.points) + parseInt(points);
        admin.points = parseInt(admin.points) - parseInt(points);

        const newDistributorLog = new distributorpointslogModel({
            distributorId: distributor._id,
            points: points,
            By: admin.name,
            Type: 'Credited',
            Balance: parseInt(distributor.points)
        })

        const newAdminLog = new adminPointsLogModel({
            adminId: admin._id,
            points: -points,
            Type: 'Debited',
            Balance: admin.points
        })

        await distributor.save();
        await newDistributorLog.save()
        await admin.save();
        await newAdminLog.save()
        return res.send({ status: true, message: "Points alloted to distributor successfully" })

    } catch (err) {
        return res.send({ status: false, message: "Something went wrong.Server error." })
    }
}

export const getDistributorPointsLog = async (req, res) => {
    try {
        const { distributorId } = req.params;
        if (!distributorId) {
            return res.send({ status: false, message: "Distributor Id not found" })
        }
        const distributor = await distributorModel.findById(distributorId);
        if (!distributor) {
            return res.send({ status: false, message: "Distributor not found" })
        }
        const distributorLogs = await distributorpointslogModel.find({ distributorId }).sort({ createdAt: -1 });
        if (distributorLogs.length === 0) {
            return res.send({ status: false, message: "No logs found for this distributor" })
        }
        return res.send({ status: true, distributorLogs })
    } catch (error) {
        return res.send({ status: false, message: "Server error" })
    }
}

// === PACKAGES ===
export const addFreePackage = async (req, res) => {
    try {
        const {
            NumOfFreeAddress,
            validity,
        } = req.body

        if (!NumOfFreeAddress ||
            !validity) {
            return res.send({ status: false, message: 'NumOfFreeAddress , validity required' })
        }

        let packageId = 1;
        const lastPackage = await freepackageModel.findOne({}).sort({ packageId: -1 })
        if (lastPackage) {
            packageId = parseInt(lastPackage?.packageId) + 1;
        }
        const newPackage = new freepackageModel({
            NumOfFreeAddress,
            validity,
            packageId,
            status: 'Active'
        })
        await freepackageModel.updateMany({}, { $set: { status: 'Inactive' } });
        await newPackage.save()
        return res.send({ status: true, message: "New Package added", newPackage });

    } catch (error) {
        return res.send({ status: false, message: 'Server error' })
    }
}

export const getFreepackages = async (req, res) => {
    try {
        const freepackages = await freepackageModel.find({}).sort({ packageId: -1 });
        if (freepackages.length === 0) {
            return res.send({ status: false, message: "No free packages found" })
        }
        return res.send({ status: true, freepackages: freepackages })
    } catch (error) {
        return res.send({ status: false, message: 'Server error' })
    }
}

export const addVipPackage = async (req, res) => {
    try {
        const {
            packageName,
            numberOfAddresses,
            memberCost,
            adminShare,
            validity
        } = req.body;

        if (!packageName || !numberOfAddresses || !memberCost || !adminShare || !validity) {
            return res.send({ status: false, message: "all fields required" })
        }

        let packageId = 1;
        const lastPackage = await vipPackageModel.findOne({}).sort({ packageId: -1 })
        if (lastPackage) {
            packageId = parseInt(lastPackage?.packageId) + 1;
        }
        const newPackage = new vipPackageModel({
            packageId,
            packageName,
            numberOfAddresses,
            memberCost,
            adminShare,
            validity
        })
        await vipPackageModel.updateMany({}, { $set: { status: 'Inactive' } });

        await newPackage.save()

        return res.send({ status: true, message: 'New vip package added.', newPackage })

    } catch (error) {
        res.status(400).json({ error: "Server error" });
    }
};

export const getAllVipPackages = async (req, res) => {
    try {
        const packages = await vipPackageModel.find().sort({ packageId: -1 });
        res.json(packages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const addMainPackage = async (req, res) => {
    try {
        const {
            packageName,
            numberOfAddresses,
            memberCost,
            adminShare,
            validity,
        } = req.body;

        if (
            !numberOfAddresses ||
            !memberCost ||
            !validity ||
            !adminShare ||
            !packageName
        ) {
            return res.send({
                status: false,
                message: 'numberOfAddresses, validity, memberCost, adminShare and packageName are required',
            });
        }

        // Generate new packageId
        let packageId = 1;
        const lastPackage = await mainPackageModel.findOne({}).sort({ packageId: -1 });
        if (lastPackage) {
            packageId = parseInt(lastPackage.packageId) + 1;
        }

        // Create new package with status: Active
        const newPackage = new mainPackageModel({
            packageId,
            packageName,
            numberOfAddresses,
            memberCost,
            validity,
            adminShare,
            status: 'Active',
        });

        // Save the new package
        await newPackage.save();

        // Get the latest 3 packages (including the newly added one)
        const latestPackages = await mainPackageModel
            .find({})
            .sort({ createdAt: -1 })
            .limit(3)
            .select('_id');

        const latestIds = latestPackages.map(pkg => pkg._id);

        // Set all packages to Inactive
        await mainPackageModel.updateMany({}, { $set: { status: 'Inactive' } });

        // Set the latest 3 packages to Active
        await mainPackageModel.updateMany(
            { _id: { $in: latestIds } },
            { $set: { status: 'Active' } }
        );

        return res.send({
            status: true,
            message: 'New Main Package added and status updated accordingly',
            newPackage,
        });
    } catch (error) {
        console.error('Error in addMainPackage:', error);
        return res.send({
            status: false,
            message: 'Server error',
        });
    }
};

export const updateMainPackages = async (req, res) => {
    try {
        const { activatePackageIds } = req.body;

        // Validate input
        if (!activatePackageIds || !Array.isArray(activatePackageIds) || activatePackageIds.length === 0) {
            return res.status(400).send({ status: false, message: "Valid package IDs are required" });
        }

        // Ensure only up to 3 IDs are processed to maintain the limit
        if (activatePackageIds.length > 3) {
            return res.status(400).send({ status: false, message: "Cannot activate more than 3 packages" });
        }

        // Get current active packages, sorted by creation date (oldest first)
        const activePackages = await mainPackageModel
            .find({ status: 'Active' })
            .sort({ createdAt: 1 })
            .select('_id');

        // Calculate how many packages need to be deactivated
        const slotsNeeded = Math.max(0, activatePackageIds.length - (3 - activePackages.length));

        // Deactivate oldest packages if needed
        if (slotsNeeded > 0) {
            const packagesToDeactivate = activePackages.slice(0, slotsNeeded);
            const deactivateIds = packagesToDeactivate.map(pkg => pkg._id);

            await mainPackageModel.updateMany(
                { _id: { $in: deactivateIds } },
                { $set: { status: 'Inactive' } }
            );
        }

        // Activate the new packages
        await Promise.all(
            activatePackageIds.map(id =>
                mainPackageModel.findByIdAndUpdate(
                    id,
                    { $set: { status: 'Active' } },
                    { new: true }
                )
            )
        );

        return res.status(200).send({ status: true, message: "Packages updated successfully" });
    } catch (error) {
        console.error('Error updating packages:', error);
        return res.status(500).send({ status: false, message: "Server error" });
    }
};

export const getMainPackages = async (req, res) => {
    try {
        const existingPackages = await mainPackageModel.find({}).sort({ status: 1 });
        if (existingPackages.length == 0) {
            return res.send({ status: false, message: "No packages found" })
        }
        return res.send({ status: true, existingPackages })
    } catch (error) {
        return res.send({ status: false, message: "Server error" })
    }
}

export const addAddOnPackage = async (req, res) => {
    try {
        const {
            packageName,
            numberOfAddresses,
            memberCost,
            distributorShare,
            franchiseShare,
            validity,
        } = req.body

        if (!packageName ||
            !numberOfAddresses ||
            !memberCost ||
            !validity ||
            !distributorShare ||
            !franchiseShare
        ) {
            return res.send({ status: false, message: 'NumOfFreeAddress , validity,memberCost,distributorShare,franchiseShare  required' })
        }

        let packageId = 1;
        const lastPackage = await addOnPackageModel.findOne({}).sort({ packageId: -1 })
        if (lastPackage) {
            packageId = parseInt(lastPackage?.packageId) + 1;
        }
        const newPackage = new addOnPackageModel({
            packageId,
            packageName,
            numberOfAddresses,
            memberCost,
            adminShare: parseInt(memberCost) - parseInt(distributorShare) - parseInt(franchiseShare),
            distributorShare,
            franchiseShare,
            validity,
            status: 'Active'
        })
        await addOnPackageModel.updateMany({}, { $set: { status: 'Inactive' } });
        await newPackage.save()
        return res.send({ status: true, message: "New Add on Package added", newPackage });
    } catch (error) {
        return res.send({ status: false, message: "Server error" })
    }
}

export const getAddOnPackages = async (req, res) => {
    try {
        const addOnPackages = await addOnPackageModel.find({}).sort({ packageId: -1 });
        if (addOnPackages.length == 0) {
            return res.send({ status: false, message: 'No packages found' })
        }
        return res.send({ status: true, addOnPackages })
    } catch (error) {
        return res.send({ status: false, message: "Server error" })
    }
}

// === MESSAGES ===
export const getUsersUnderFranchise = async (req, res) => {
    try {
        const franchiseId = req.params.id;
        console.log(franchiseId)
        const currentFranchise = await franchiseModel.findById(franchiseId);

        const lowerLimit = parseInt(req.query.lowerLimit) || 0;  // start from 0
        const upperLimit = parseInt(req.query.upperLimit) || 10; // number of results

        const allUsers = await userModel
            .find({ franchiseUnder: currentFranchise.franchiseName }, '-_id -__v -franchiseUnder -createdBy -password')
            .skip(lowerLimit)
            .limit(upperLimit);

        return res.send({ status: true, result: allUsers });

    } catch (error) {
        console.error(error);
        return res.send({ status: false, message: "Server Error" });
    }
}

export const sendMessageFromAdmin = async (req, res) => {
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

        const admin = await adminModel.findById(senderId);
        if (!admin) return res.send({ status: false, message: "Admin not found" });

        const to = await Promise.all(receiverIds.map(id => getUserNameById(id)));

        const newMessage = new MessageModel({
            senderId,
            receiverId: receiverIds,
            from: `${admin.name}`,
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

export const draftMessageFromAdmin = async (req, res) => {
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

        const admin = await adminModel.findById(senderId);
        if (!admin) return res.send({ status: false, message: "Admin not found" });

        const to = await Promise.all(receiverIds.map(id => getUserNameById(id)));

        const draftMessage = new MessageModel({
            senderId,
            receiverId: receiverIds,
            from: `${admin.name}`,
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

export const getSentMessagesForAdmin = async (req, res) => {
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

export const getDraftedMessagesForAdmin = async (req, res) => {
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

export const getRepliesForAdmin = async (req, res) => {
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

// === REPORTS ===
// add parentsResidence field here 
export const getReports = async (req, res) => {
    try {
        const { filters = {}, fields = [] } = req.body;
        let query = {};

        // Native Location
        if (filters.nativeCountry) query["nativeCity.country"] = filters.nativeCountry;
        if (filters.nativeState) query["nativeCity.state"] = filters.nativeState;
        if (filters.nativeCity) query["nativeCity.city"] = filters.nativeCity;

        // Working Location
        if (filters.workCountry) query["workLocation.country"] = filters.workCountry;
        if (filters.workState) query["workLocation.state"] = filters.workState;
        if (filters.workCity) query["workLocation.city"] = filters.workCity;

        // Community Info
        if (filters.religion) query["caste.religion"] = filters.religion;
        if (filters.caste) query["caste.caste"] = filters.caste;
        if (filters.subCaste) query["caste.subCaste"] = filters.subCaste;
        if (filters.motherTongue) query["motherTongue"] = filters.motherTongue;

        // Career Info
        if (filters.education) {
            if (Array.isArray(filters.education)) {
                query["education"] = { $in: filters.education };
            } else {
                query["education"] = filters.education;
            }
        }
        if (filters.occupation) query["occupation"] = filters.occupation;
        if (filters.monthlyIncome) {
            const income = Number(filters.monthlyIncome);
            if (!isNaN(income)) query["monthlyIncome"] = { $gte: income };
        }

        // Other Info
        if (filters.maritalStatus) query["maritalStatus"] = filters.maritalStatus;
        if (filters.divyang) query["divyang"] = filters.divyang;

        // Hierarchy
        if (filters.distributor) query["CreatedBy"] = filters.distributor;
        if (filters.franchise) query["franchiseUnder"] = filters.franchise;

        // Build projection (fields to return)
        let projection = null;
        if (fields && fields.length > 0) {
            projection = {};
            fields.forEach(field => {
                projection[field] = 1;
            });
            // Optional: exclude _id if not needed
            // projection["_id"] = 0;
        }

        // Query database
        const users = projection
            ? await userModel.find(query, projection)
            : await userModel.find(query);

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error. Check your request body.",
            error: error.message
        });
    }
};

export const searchUsers = async (req, res) => {
    try {
        const { searchTerm } = req.body;

        if (!searchTerm) {
            return res.status(400).json({
                status: false,
                message: 'Search term is required'
            });
        }

        const regex = new RegExp(searchTerm, 'i');
        const isNumber = !isNaN(searchTerm);
        const numericValue = isNumber ? parseInt(searchTerm) : null;

        // Optional quick match by UserId
        if (isNumber) {
            const userById = await userModel.findOne({ UserId: numericValue }).select('-password');
            if (userById) {
                return res.status(200).json({
                    success: true,
                    totalCount: 1,
                    message: 'User found by ID',
                    data: [userById]
                });
            }
        }

        // Flat fields that can be regex-searched
        const searchFields = [
            'loginEmail', 'loginNumber', 'firstName', 'lastName', 'midname', 'gender',
            'timeOfBirth', 'placeOfBirth', 'maritalStatus', 'occupation', 'motherTongue',
            'divyang', 'mothersName', 'fathersName', 'mamkul', 'parentsResidence',
            'parentsCity', 'alternateNumber', 'brothers', 'sisters', 'otherInfo',
            'nativeVillage', 'companyName', 'designation', 'candidateNumber',
            'candidateEmail', 'userPhotoStatus', 'sect', 'manglik', 'foodPreference',
            'bloodGroup', 'specs', 'gotra',
            // Nested fields with dot notation
            'nativeCity.country', 'nativeCity.state', 'nativeCity.city',
            'workLocation.country', 'workLocation.state', 'workLocation.city',
            'caste.religion', 'caste.caste', 'caste.subCaste',
            'children.gender', 'children.livesWith'
        ];

        const numericFields = [
            'height', 'parentsContact', 'whatsApp',
            'brothersCount', 'sistersExactCount', 'monthlyIncome',
            'freeAddresses', 'numberOfAddresses'
        ];

        const orQuery = [];

        searchFields.forEach(field => {
            orQuery.push({ [field]: { $regex: regex } });
        });

        if (isNumber) {
            numericFields.forEach(field => {
                orQuery.push({ [field]: numericValue });
            });
        }

        // Search in full name (concat)
        orQuery.push({
            $expr: {
                $regexMatch: {
                    input: { $concat: ['$firstName', ' ', '$midname', ' ', '$lastName'] },
                    regex: regex
                }
            }
        });

        const users = await userModel.find({ $or: orQuery }).select('-password');

        if (!users || users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No users found matching the search criteria'
            });
        }

        res.status(200).json({
            success: true,
            totalCount: users.length,
            message: 'Users found',
            data: users
        });
    } catch (error) {
        console.error('Error in searchUsers:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};
