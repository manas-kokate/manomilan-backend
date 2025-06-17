import express from "express"
import { uploadMiddleware } from "../utils/upload.js";
import { registerUser, login, getLoggedInUser, mutualMatching, editProfile } from "../controllers/user.controller.js";
import { userAuth } from "../middlewares/auth.js"
import { getAllCastes, getAllLocations, getAllStates, getAllSubCastes, getCountry, getReligion } from "../controllers/admin.controller.js";


const router = express.Router();

// USER
router.post('/register', uploadMiddleware, registerUser);
router.post('/login', login);
router.put('/editprofile', userAuth, editProfile)

// LOCATIONS
router.get('/get-countries', getCountry);
router.get('/get-all-states', getAllStates);
router.get('/get-all-locations', getAllLocations)


// CASTE 
router.get('/get-religion', getReligion);
router.get('/get-all-castes', getAllCastes);
router.get('/get-all-subcastes', getAllSubCastes);



router.get('/getcurrentuser', userAuth, getLoggedInUser);

router.get('/mutual-matching', userAuth, mutualMatching);

export default router





// router.get('/')