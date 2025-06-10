import express from "express"
import { uploadMiddleware } from "../utils/upload.js";
import { registerUser, login, getLoggedInUser, mutualMatching, getcountries, getStates, getLocationEntry, editProfile } from "../controllers/user.controller.js";
import { userAuth } from "../middlewares/auth.js"
import { getCasteEntry } from "../controllers/admin.controller.js";


const router = express.Router();

// USER
router.post('/register', uploadMiddleware, registerUser);
router.post('/login', login);
router.put('/editprofile', userAuth, editProfile)

// LOCATIONS
router.get('/getcountries', userAuth, getcountries);
router.get('/getstates', userAuth, getStates);
router.get('/getlocationEntry', userAuth, getLocationEntry);

// CASTE 
router.get('/getcasteEntry', userAuth, getCasteEntry)

router.get('/getcurrentuser', userAuth, getLoggedInUser);

router.get('/mutual-matching', userAuth, mutualMatching);

export default router





// router.get('/')