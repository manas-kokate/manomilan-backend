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
    getAllStreams
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


// === FOOD CHOICES ===
router.get('/food-choices', getFoodPref);



export default router





// router.get('/')