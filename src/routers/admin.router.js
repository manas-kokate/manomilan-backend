import express from 'express'
import {
    getUsers,
    loginAdmin,
    registerAdmin,
    updateUserPfp,
    deleteUser,
    getCountry,
    addcountry,
    getStateCountry,
    addStateCountry,
    addlocationEntry,
    getlocationEntry,
    getAllStates,
    getAllLocations, getReligion,
    addReligion,
    getAllCastes,
    getCasteByReligion,
    addCasteReligion,
    getAllSubCastes,
    getSubCasteEntry,
    addSubCasteEntry,
    deleteCountry,
    deleteStateCountry,
    deleteCity,
    deleteReligion,
    deleteCaste,
    deleteSubCaste
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
router.post('/addcountries', addcountry);
router.delete('/delete-country', deleteCountry)

// ===  STATE ROUTES ===
router.get('/get-state-country', adminAuth, getStateCountry)
router.get('/get-all-states', adminAuth, getAllStates)
router.post('/add-state-country', adminAuth, addStateCountry);
router.delete('/delete-state-country', deleteStateCountry)

// === LOCATIONS ===
router.get('/get-all-locations', adminAuth, getAllLocations);
router.get('/get-location', adminAuth, getlocationEntry);
router.post('/add-location', adminAuth, addlocationEntry);
router.delete('/delete-city', adminAuth, deleteCity)

// === RELIGION ROUTES ===
router.get('/religion', adminAuth, getReligion);
router.post('/religion', adminAuth, addReligion);
router.delete('/delete-religion', adminAuth, deleteReligion)

// === CASTE ROUTES ===
router.get('/caste', adminAuth, getAllCastes);
router.post('/caste/by-religion', adminAuth, getCasteByReligion);
router.post('/caste', adminAuth, addCasteReligion);
router.delete('/delete-caste', adminAuth, deleteCaste)

// === SUBCASTE ROUTES ===
router.get('/subcaste', adminAuth, getAllSubCastes);
router.post('/subcaste/by-caste-religion', adminAuth, getSubCasteEntry);
router.post('/subcaste', adminAuth, addSubCasteEntry);
router.delete('/delete-subcaste', adminAuth, deleteSubCaste);


export default router