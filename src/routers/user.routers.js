import express from "express"
import { uploadMiddleware } from "../utils/upload.js";
import { registerUser, login, getLoggedInUser, editProfile, getFranchises, mutualMatching, sendMessageFromUser, draftMessageFromUser, getSentMessagesForUser, getDraftedMessagesForUser, getRepliesForUser, getFrachiseAndDistributorAndAdmin, getCurrentUser, editExpectaions, getUserPackages, subscribe, subscribed, verifyOtpAndChangeUserPassword, getOtpForUser, inActivateUser, getAvailablePackages, checkUserExists } from "../controllers/user.controller.js";
import { userAuth } from "../middlewares/auth.js"
import {
    getCountry, getDegreesByStream, getFoodPref, getReligion,
    getAllSubCastes,
    getAllStreams,
    getBodyTypes,
    getComplexions,
    getFamilyBgs,
    getSects,
    getPositions,
    getMangliks,
    addMotherTongue,
    getStateCountry,
    getlocationEntry,
    getCasteByReligion,
    getAllStates,
    getAllLocations,
    getSubCasteEntry,
} from "../controllers/admin.controller.js";
import { deleteMessage } from "../controllers/distributor.controller.js";



const router = express.Router();

// === USER ===
router.post('/register', uploadMiddleware, registerUser);
router.post('/login', login);
router.post('/get-otp', getOtpForUser);
router.post('/verify-otp-reset-password', verifyOtpAndChangeUserPassword);

router.put('/editprofile', userAuth, editProfile)
router.get('/getcurrentuser', userAuth, getLoggedInUser);
router.get('/getCurrentUser/:userId', getCurrentUser)
router.put('/expectation-edit', userAuth, editExpectaions)

// INACTIVATE USER
router.put('/inactivate-user', userAuth, inActivateUser)

// === GET FRANCHISE ===
router.get('/get-franchises', getFranchises);

// === LOCATIONS ====
router.get('/get-all-countries', getCountry);
router.get('get-all-states', getAllStates)
router.get('/get-state-by-country', getStateCountry);
router.get('/get-all-cities', getAllLocations)
router.get('/get-cities-by-state', getlocationEntry);

// === CASTE ===
router.get('/get-religions', getReligion);
router.get('/get-caste-by-religion', getCasteByReligion);
router.get('/get-all-subcaste', getAllSubCastes);
router.get('/get-subcaste-by-caste', getSubCasteEntry);

// === EDUCATION ===
router.get('/get-all-stream', getAllStreams);
router.post('/get-degree-by-stream', getDegreesByStream);

// Body Type
router.get("/get-bodytype", getBodyTypes);

// Complexion
router.get("/get-complexion", getComplexions);

// Family Background
router.get("/get-familybg", getFamilyBgs);

// Sect
router.get("/get-sect", getSects);

// Position
router.get("/get-position", getPositions);

// Manglik
router.get("/get-manglik", getMangliks);

// === MOTHER TONGUE ===
router.post('/add-mother-tongue', addMotherTongue);

// === FOOD CHOICES ===
router.get('/food-choices', getFoodPref);

// === MUTUAL MATCHING ===
router.get('/mutual-matching', userAuth, mutualMatching)

// === SUBSCRIBE ===
router.post('/subscribe', userAuth, subscribe);
router.get('/getSubscribes', userAuth, subscribed);

// === MESSAGES === 

router.get('/get-franchise-distributor/:franchiseUnder', getFrachiseAndDistributorAndAdmin)

router.post('/message/send', userAuth, sendMessageFromUser)
router.get('/message/get-sendMessages', userAuth, getSentMessagesForUser);

router.post('/message/draft', userAuth, draftMessageFromUser);
router.get('/message/get-draftedMessages', userAuth, getDraftedMessagesForUser);

router.get('/message/replies', userAuth, getRepliesForUser);

router.delete('/delete-message', deleteMessage);

// === PACKAGE ===
router.get('/get-packages/:userId', getUserPackages)
router.get('/get-available-packages', getAvailablePackages)

// check user status
router.post('/user-exists', checkUserExists)


export default router
