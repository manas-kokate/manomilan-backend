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
    getStreams,
    deleteDegree,
    deleteStream,
    addFoodPref,
    getFoodPref
} from '../controllers/admin.controller.js';
import { adminAuth } from '../middlewares/auth.js';


const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

// === USER ==== 
router.get('/getusers', adminAuth, getUsers);
router.put('/updateuserpfp', adminAuth, updateUserPfp);
router.delete('/deleteruser', adminAuth, deleteUser);

// === COUNTRY === 
router.get('/get-country', getCountry);
router.post('/add-country', addcountry);
router.delete('/delete-country', deleteCountry);
router.put('/update-country', updateCountry);


// ===  STATE ROUTES ===
router.get('/get-state-country', getStateCountry);
router.get('/get-all-states', getAllStates);
router.post('/add-state-country', addStateCountry);
router.delete('/delete-state-country', deleteStateCountry);
router.put('/update-state-country', updateState);

// === CITY ===
router.get('/get-all-cities', getAllLocations);
router.get('/get-state-city', getlocationEntry);
router.post('/add-state-city', addlocationEntry);
router.delete('/delete-city', deleteCity);
router.put('/update-city', updateCity);

// === RELIGION ROUTES ===
router.get('/get-religion', getReligion);
router.post('/add-religion', addReligion);
router.put('/update-religion', updateReligion);
router.delete('/delete-religion', deleteReligion);

// === CASTE ROUTES ===
router.get('/get-all-castes', getAllCastes);
router.post('/get-castes-by-religion', getCasteByReligion);
router.post('/add-caste', addCasteReligion);
router.put('/update-caste', updateCaste);
router.delete('/delete-caste', deleteCaste);

// === SUBCASTE ROUTES ===
router.get('/get-all-subcastes', getAllSubCastes);
router.post('/get-subcastes-by-entry', getSubCasteEntry);
router.post('/add-subcaste', addSubCasteEntry);
router.put('/update-subcaste', updateSubCaste);
router.delete('/delete-subcaste', deleteSubCaste);


// === EDUCATION ===

//=== DEGREE ====
router.get('/get-all-degrees', getAllDegrees);
router.get('/get-degrees-by-stream', getDegreesByStream);
router.post('/add-degree', addDegree);
router.delete('/delete-degree', deleteDegree);

// === STREAMS ===
router.get('/get-streams', getStreams);
router.post('/add-stream', addStream);
router.delete('/delete-stream', deleteStream);

// === FOOD CHOICES ===
router.get('/get-foodPref', getFoodPref);
router.post('/add-foodPref', addFoodPref);
router.get('/get-foodPref', getFoodPref);


export default router