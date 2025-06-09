import express from "express"
import { uploadMiddleware } from "../utils/upload.js";
import { registerUser, login, addExpectations, updateExpectation, getLoggedInUser, mutualMatching, getcountries, getStates, getLocationEntry } from "../controllers/user.controller.js";
import { userAuth } from "../middlewares/auth.js"
import { getCasteEntry } from "../controllers/admin.controller.js";


const router = express.Router();

router.post('/register', uploadMiddleware, registerUser);
router.post('/login', login);
router.get('/getcountries', userAuth, getcountries);
router.get('/getstates', userAuth, getStates);
router.get('/getlocationEntry', userAuth, getLocationEntry);
router.get('/getcasteEntry', userAuth, getCasteEntry)
router.get('/getcurrentuser', userAuth, getLoggedInUser);
router.get('/mutual-matching', userAuth, mutualMatching)
router.post('/addexpectations', userAuth, addExpectations);
router.put('/editexpectation', userAuth, updateExpectation);

export default router





// router.get('/')