import express from 'express'
import { getUsers, loginAdmin, registerAdmin, updateUserPfp, deleteUser, getCountry, addcountry, getStateCountry, addStateCountry, addlocationEntry, getlocationEntry, getAllStates, getAllLocations } from '../controllers/admin.controller.js';
import { adminAuth } from '../middlewares/auth.js';


const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

// USERS 
router.get('/getusers', adminAuth, getUsers);
router.put('/updateuserpfp', adminAuth, updateUserPfp);
router.delete('/deleteruser', adminAuth, deleteUser);

// LOCATIONS 
router.get('/getcountries', adminAuth, getCountry);
router.post('/addcountries', adminAuth, addcountry);

router.get('/get-state-country', adminAuth, getStateCountry)
router.get('/get-all-states', adminAuth, getAllStates)
router.post('/add-state-country', adminAuth, addStateCountry);

router.get('/get-all-locations', adminAuth, getAllLocations);
router.get('/get-location', getlocationEntry);
router.post('/add-location', addlocationEntry);

//caste,subcaste,religion


export default router