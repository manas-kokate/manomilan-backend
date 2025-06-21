import express from "express"
import { uploadMiddleware } from "../utils/upload.js";
import { registerUser, login, getLoggedInUser, editProfile } from "../controllers/user.controller.js";
import { userAuth } from "../middlewares/auth.js"
import {
    getCountry, getDegreesByStream, getFoodPref, getReligion,
    getAllLocations,
    getAllCastes,
    getAllStates,
    getAllSubCastes,
    getAllStreams,
    getBodyTypes,
    getComplexions,
    getFamilyBgs,
    getSects,
    getPositions,
    getMangliks,
    addMotherTongue
} from "../controllers/admin.controller.js";


const router = express.Router();

// === USER ===
router.post('/register', uploadMiddleware, registerUser);
router.post('/login', login);
router.put('/editprofile', userAuth, editProfile)
router.get('/getcurrentuser', userAuth, getLoggedInUser);

// === LOCATIONS ====
router.get('/get-all-countries', getCountry);
router.get('/get-all-state', getAllStates);
router.get('/get-all-cities', getAllLocations);

// === CASTE ===
router.get('/get-religions', getReligion);
router.get('/get-all-caste', getAllCastes);
router.get('/get-all-subcaste', getAllSubCastes)

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



export default router





// router.get('/')