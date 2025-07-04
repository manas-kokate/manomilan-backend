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

    const token = jwt.sign({ id: ExistingAdmin._id }, envCredentials.secretKey, { expiresIn: '4h' })

    return res.send({ status: true, message: "User Login successful.", token: token });
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
