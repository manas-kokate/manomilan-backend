import express from "express"
import { uploadMiddleware } from "../utils/upload.js";
import { registerUser, login, getLoggedInUser, mutualMatching, editProfile } from "../controllers/user.controller.js";
import { userAuth } from "../middlewares/auth.js"
import { getCountry, getStateCountry } from "../controllers/admin.controller.js";


const router = express.Router();

// USER
router.post('/register', uploadMiddleware, registerUser);
router.post('/login', login);
router.put('/editprofile', userAuth, editProfile)

// LOCATIONS
router.get('/getcountries', userAuth, getCountry);
router.get('/getstates', userAuth, getStateCountry);


// CASTE 


router.get('/getcurrentuser', userAuth, getLoggedInUser);

router.get('/mutual-matching', userAuth, mutualMatching);

export default router





// router.get('/')