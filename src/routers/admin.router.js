import express from 'express'
import {
    getUsers, loginAdmin, registerAdmin, updateUserPfp, deleteUser, getCountry, addcountry, getStateCountry, addStateCountry, addlocationEntry, getlocationEntry, getAllStates, getAllLocations, getReligion,
    addReligion,
    getAllCastes,
    getCasteByReligion,
    addCasteReligion,
    getAllSubCastes,
    getSubCasteEntry,
    addSubCasteEntry
} from '../controllers/admin.controller.js';
import { adminAuth } from '../middlewares/auth.js';


const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

// USERS 
router.get('/getusers', adminAuth, getUsers);
router.put('/updateuserpfp', adminAuth, updateUserPfp);
router.delete('/deleteruser', adminAuth, deleteUser);

// === COUNTRY=== 
router.get('/getcountries', adminAuth, getCountry);
router.post('/addcountries', adminAuth, addcountry);

// ===  STATE ROUTES ===
router.get('/get-state-country', adminAuth, getStateCountry)
router.get('/get-all-states', adminAuth, getAllStates)
router.post('/add-state-country', adminAuth, addStateCountry);

// === LOCATIONS ===
router.get('/get-all-locations', adminAuth, getAllLocations);
router.get('/get-location', getlocationEntry);
router.post('/add-location', addlocationEntry);

// === RELIGION ROUTES ===
router.get('/religion', getReligion);
router.post('/religion', addReligion);

// === CASTE ROUTES ===
router.get('/caste', getAllCastes);
router.post('/caste/by-religion', getCasteByReligion);
router.post('/caste', addCasteReligion);

// === SUBCASTE ROUTES ===
router.get('/subcaste', getAllSubCastes);
router.post('/subcaste/by-caste-religion', getSubCasteEntry);
router.post('/subcaste', addSubCasteEntry);


export default router