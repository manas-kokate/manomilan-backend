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
    deleteSubCaste,
    updateCountry,
    updateState,
    updateCity,
    updateReligion,
    updateCaste,
    updateSubCaste,
    addDegree,
    addStream,
    getAllDegrees,
    getDegreesByStream,
    getStreams
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
router.get('/getcountries', getCountry);
router.post('/addcountries', addcountry);
router.delete('/delete-country', deleteCountry);
router.put('/update-country', updateCountry);

// ===  STATE ROUTES ===
router.get('/get-state-country', getStateCountry)
router.get('/get-all-states', getAllStates)
router.post('/add-state-country', addStateCountry);
router.delete('/delete-state-country', deleteStateCountry)
router.put('/update-state', updateState)
// === LOCATIONS ===
router.get('/get-all-locations', adminAuth, getAllLocations);
router.get('/get-location', adminAuth, getlocationEntry);
router.post('/add-location', adminAuth, addlocationEntry);
router.delete('/delete-city', adminAuth, deleteCity);
router.put('/update-city', adminAuth, updateCity);

// === RELIGION ROUTES ===
router.get('/get-religion', getReligion);
router.post('/add-religion', addReligion);
router.delete('/delete-religion', deleteReligion)
router.put('/update-religion', updateReligion);

// === CASTE ROUTES ===
router.get('/caste', getAllCastes);
router.post('/caste/by-religion', deleteCaste)
router.put('/update-caste', updateCaste);

// === SUBCASTE ROUTES ===
router.get('/get-all-subcaste', getAllSubCastes);
router.post('/get-subcaste-by-caste-religion', getSubCasteEntry);
router.post('/add-subcaste', addSubCasteEntry);
router.delete('/delete-subcaste', deleteSubCaste);
router.put('/update-subcaste', updateSubCaste);


// === EDUCATION ===
router.get('/get-degree-by-stream', getDegreesByStream)
router.get('/get-degree', getAllDegrees);
router.post('/add-degree', addDegree);

router.get('/get-stream', getStreams);
router.post('/add-stream', addStream);


export default router