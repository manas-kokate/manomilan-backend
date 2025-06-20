import express from "express"
import { uploadMiddleware } from "../utils/upload.js";
import { registerUser, login, getLoggedInUser, mutualMatching, editProfile } from "../controllers/user.controller.js";
import { userAuth } from "../middlewares/auth.js"
import {
    getAllDegrees, getCasteByReligion, getCountry, getDegreesByStream, getFoodPref, getlocationEntry, getReligion, getStateCountry, getStreams, getSubCasteEntry,
    addBodyType, getBodyTypes, deleteBodyType,
    addComplexion, getComplexions, deleteComplexion,
    addFamilyBg, getFamilyBgs, deleteFamilyBg,
    addSect, getSects, deleteSect,
    addPosition, getPositions, deletePosition,
    addManglik, getMangliks, deleteManglik
} from "../controllers/admin.controller.js";


const router = express.Router();

// === USER ===
router.post('/register', uploadMiddleware, registerUser);
router.post('/login', login);
router.put('/editprofile', userAuth, editProfile)
router.get('/getcurrentuser', userAuth, getLoggedInUser);

// === LOCATIONS ====
router.get('/get-country', getCountry);
router.get('/get-state-by-country', getStateCountry);
router.get('/get-city-by-state', getlocationEntry);

// === CASTE ===
router.get('/get-religions', getReligion);
router.get('/get-caste-by-religion', getCasteByReligion);
router.get('/get-subcaste-by-caste', getSubCasteEntry)

// === EDUCATION ===
router.get('/get-stream', getStreams);
router.get('/get-degree-by-stream', getDegreesByStream);

// === FOOD CHOICES ===
router.get('/food-choices', getFoodPref);

// Body Type
router.post("/add-bodytype", addBodyType);
router.get("/get-bodytype", getBodyTypes);
router.delete("/delete-bodytype", deleteBodyType);

// Complexion
router.post("/add-complexion", addComplexion);
router.get("/get-complexion", getComplexions);
router.delete("/delete-complexion", deleteComplexion);

// Family Background
router.post("/add-familybg", addFamilyBg);
router.get("/get-familybg", getFamilyBgs);
router.delete("/delete-familybg", deleteFamilyBg);

// Sect
router.post("/add-sect", addSect);
router.get("/get-sect", getSects);
router.delete("/delete-sect", deleteSect);

// Position
router.post("/add-position", addPosition);
router.get("/get-position", getPositions);
router.delete("/delete-position", deletePosition);

// Manglik
router.post("/add-manglik", addManglik);
router.get("/get-manglik", getMangliks);
router.delete("/delete-manglik", deleteManglik);

export default router





// router.get('/')